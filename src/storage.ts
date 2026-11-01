import { initialDraft, validateTeacher, validateClass } from "./model";
import type { Classroom, PrototypeStore } from "./model";

export const STORAGE_KEY = "reign.teacher-prototype.v1";
type StorageAccess = Pick<Storage, "getItem" | "setItem">;
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function isClass(value: unknown): value is Classroom {
  if (!record(value)) return false;
  if (
    typeof value.id !== "string" ||
    !value.id ||
    typeof value.code !== "string" ||
    !/^[A-Z2-9]{8}$/.test(value.code)
  )
    return false;
  if (
    typeof value.name !== "string" ||
    !Number.isSafeInteger(value.startingCashCents) ||
    typeof value.tradingEnabled !== "boolean"
  )
    return false;
  if (value.investmentAccess !== "all" && value.investmentAccess !== "approved")
    return false;
  if (
    !Array.isArray(value.approvedSymbols) ||
    value.approvedSymbols.some((s) => typeof s !== "string")
  )
    return false;
  if (
    value.positionLimitPercent !== null &&
    (!Number.isInteger(value.positionLimitPercent) ||
      typeof value.positionLimitPercent !== "number")
  )
    return false;
  if (typeof value.startDate !== "string" || typeof value.endDate !== "string")
    return false;
  for (const field of ["createdAt", "updatedAt"])
    if (
      typeof value[field] !== "string" ||
      Number.isNaN(Date.parse(value[field]))
    )
      return false;
  if (
    value.weeklyDeposit !== null &&
    (!record(value.weeklyDeposit) ||
      !Number.isSafeInteger(value.weeklyDeposit.amountCents) ||
      typeof value.weeklyDeposit.day !== "string")
  )
    return false;
  try {
    return (
      Object.keys(
        validateClass(initialDraft(undefined, value as unknown as Classroom)),
      ).length === 0
    );
  } catch {
    return false;
  }
}

export function decodeStore(raw: string): PrototypeStore {
  const value: unknown = JSON.parse(raw);
  if (
    !record(value) ||
    value.version !== 1 ||
    !record(value.teacher) ||
    !Array.isArray(value.classes)
  )
    throw new Error("Unsupported prototype data.");
  if (
    typeof value.teacher.name !== "string" ||
    typeof value.teacher.email !== "string"
  )
    throw new Error("Invalid teacher profile.");
  const teacher = { name: value.teacher.name, email: value.teacher.email };
  if (
    Object.keys(validateTeacher(initialDraft(teacher))).length ||
    !value.classes.every(isClass)
  )
    throw new Error("Invalid saved class data.");
  const classes = value.classes;
  if (
    new Set(classes.map((c) => c.id)).size !== classes.length ||
    new Set(classes.map((c) => c.code)).size !== classes.length
  )
    throw new Error("Duplicate saved classes.");
  return { version: 1, teacher, classes };
}

export function loadStore(storage: StorageAccess): PrototypeStore | null {
  const raw = storage.getItem(STORAGE_KEY);
  return raw === null ? null : decodeStore(raw);
}

export function persistStore(
  storage: StorageAccess,
  value: PrototypeStore,
): void {
  const serialized = JSON.stringify(value);
  decodeStore(serialized);
  // Callers update the visible state only after this succeeds.
  storage.setItem(STORAGE_KEY, serialized);
}
