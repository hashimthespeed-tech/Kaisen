import { describe, expect, it } from "vitest";
import {
  createClass,
  initialDraft,
  parseMoney,
  settingsFrom,
  updateClass,
  validateClass,
  validateTeacher,
} from "./model";
import { decodeStore, loadStore, persistStore } from "./storage";

const draft = () => ({
  ...initialDraft(),
  teacherName: "Alex Morgan",
  email: "alex@example.com",
  className: "Economics · Period 3",
});
const store = () => ({
  version: 1 as const,
  teacher: { name: "Alex Morgan", email: "alex@example.com" },
  classes: [createClass(settingsFrom(draft()), [])],
});

describe("Teacher and class setup", () => {
  it("requires a valid name and email without a password", () => {
    expect(validateTeacher(draft())).toEqual({});
    expect(
      validateTeacher({ ...draft(), teacherName: " ", email: "not-an-email" }),
    ).toHaveProperty("email");
    expect(validateTeacher({ ...draft(), teacherName: " " })).toHaveProperty(
      "teacherName",
    );
  });
  it("stores exact cents and rejects unsupported or unsafe money inputs", () => {
    expect(parseMoney("10.29")).toBe(1029);
    expect(parseMoney("0.01")).toBe(1);
    expect(parseMoney("1000000")).toBe(100000000);
    for (const value of [
      "0",
      "-1",
      "1e3",
      "0.001",
      "",
      "1,000",
      "1000000.01",
      "Infinity",
    ])
      expect(parseMoney(value)).toBeNull();
  });
  it("normalizes approved symbols but rejects empty and malformed lists", () => {
    const chosen = {
      ...draft(),
      investmentAccess: "approved" as const,
      approvedSymbols: "aapl, MSFT aapl BRK.B",
    };
    expect(settingsFrom(chosen).approvedSymbols).toEqual([
      "AAPL",
      "MSFT",
      "BRK.B",
    ]);
    for (const approvedSymbols of ["", "AAPL,$BAD", "3M"])
      expect(validateClass({ ...chosen, approvedSymbols })).toHaveProperty(
        "approvedSymbols",
      );
  });
  it("checks calendar dates, deposit amounts, and position limits", () => {
    expect(
      validateClass({ ...draft(), startDate: "2026-02-30" }),
    ).toHaveProperty("startDate");
    expect(
      validateClass({
        ...draft(),
        startDate: "2026-11-10",
        endDate: "2026-11-01",
      }),
    ).toHaveProperty("endDate");
    expect(
      validateClass({ ...draft(), limitPosition: true, positionLimit: "101" }),
    ).toHaveProperty("positionLimit");
    expect(
      validateClass({ ...draft(), limitPosition: true, positionLimit: "2.5" }),
    ).toHaveProperty("positionLimit");
    expect(
      validateClass({ ...draft(), weeklyEnabled: true, weeklyAmount: "0" }),
    ).toHaveProperty("weeklyAmount");
    expect(
      settingsFrom({
        ...draft(),
        weeklyEnabled: true,
        weeklyAmount: "50.25",
        weeklyDay: "Friday",
      }).weeklyDeposit,
    ).toEqual({ amountCents: 5025, day: "Friday" });
  });
  it("removes inactive options from saved settings", () => {
    const settings = settingsFrom({
      ...draft(),
      approvedSymbols: "AAPL",
      weeklyAmount: "-50",
      positionLimit: "200",
    });
    expect(settings.approvedSymbols).toEqual([]);
    expect(settings.weeklyDeposit).toBeNull();
    expect(settings.positionLimitPercent).toBeNull();
  });
  it("preserves class identity and code while editing its rules", () => {
    const first = createClass(
      settingsFrom(draft()),
      [],
      new Date("2026-11-01T12:00:00Z"),
    );
    const second = createClass(settingsFrom(draft()), [first]);
    expect(second.code).not.toBe(first.code);
    expect(second.id).not.toBe(first.id);
    const updated = updateClass(
      first,
      {
        ...settingsFrom(draft()),
        name: "Updated class",
        tradingEnabled: false,
      },
      new Date("2026-11-02T12:00:00Z"),
    );
    expect(updated.id).toBe(first.id);
    expect(updated.code).toBe(first.code);
    expect(updated.createdAt).toBe(first.createdAt);
    expect(updated.updatedAt).not.toBe(first.updatedAt);
    expect(updated.tradingEnabled).toBe(false);
  });
});

describe("Browser prototype storage", () => {
  it("round-trips valid data and handles a first visit", () => {
    let raw: string | null = null;
    const storage = {
      getItem: () => raw,
      setItem: (_key: string, value: string) => {
        raw = value;
      },
    };
    expect(loadStore(storage)).toBeNull();
    const value = store();
    persistStore(storage, value);
    expect(loadStore(storage)).toEqual(value);
  });
  it("rejects corrupt, unsupported, malformed and duplicate records", () => {
    const valid = store();
    const invalid = [
      null,
      {},
      { ...valid, version: 2 },
      { ...valid, teacher: { name: "A", email: "bad" } },
      { ...valid, classes: [valid.classes[0], valid.classes[0]] },
      { ...valid, classes: [{ ...valid.classes[0], startingCashCents: -1 }] },
      {
        ...valid,
        classes: [
          {
            ...valid.classes[0],
            weeklyDeposit: { amountCents: 100, day: "Someday" },
          },
        ],
      },
    ];
    for (const value of invalid)
      expect(() => decodeStore(JSON.stringify(value))).toThrow();
    expect(() => decodeStore("broken JSON")).toThrow();
  });
  it("propagates storage failure so the UI cannot claim a successful save", () => {
    const storage = {
      getItem: () => null,
      setItem: () => {
        throw new Error("Quota exceeded");
      },
    };
    expect(() => persistStore(storage, store())).toThrow("Quota exceeded");
  });
});
