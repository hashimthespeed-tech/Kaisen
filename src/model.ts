export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
export type Weekday = (typeof WEEKDAYS)[number];
export type TeacherProfile = { name: string; email: string };
export type ClassSettings = {
  name: string;
  startingCashCents: number;
  investmentAccess: "all" | "approved";
  approvedSymbols: string[];
  tradingEnabled: boolean;
  positionLimitPercent: number | null;
  weeklyDeposit: { amountCents: number; day: Weekday } | null;
  startDate: string;
  endDate: string;
};
export type Classroom = ClassSettings & {
  id: string;
  code: string;
  createdAt: string;
  updatedAt: string;
};
export type PrototypeStore = {
  version: 1;
  teacher: TeacherProfile;
  classes: Classroom[];
};
export type SetupDraft = {
  teacherName: string;
  email: string;
  className: string;
  startingCash: string;
  investmentAccess: "all" | "approved";
  approvedSymbols: string;
  tradingEnabled: boolean;
  limitPosition: boolean;
  positionLimit: string;
  weeklyEnabled: boolean;
  weeklyAmount: string;
  weeklyDay: Weekday;
  startDate: string;
  endDate: string;
};
export type Errors = Partial<Record<keyof SetupDraft, string>>;

export function initialDraft(
  teacher?: TeacherProfile,
  classroom?: Classroom,
): SetupDraft {
  return {
    teacherName: teacher?.name ?? "",
    email: teacher?.email ?? "",
    className: classroom?.name ?? "",
    startingCash: classroom
      ? String(classroom.startingCashCents / 100)
      : "10000",
    investmentAccess: classroom?.investmentAccess ?? "all",
    approvedSymbols: classroom?.approvedSymbols.join(", ") ?? "",
    tradingEnabled: classroom?.tradingEnabled ?? true,
    limitPosition: classroom?.positionLimitPercent != null,
    positionLimit: String(classroom?.positionLimitPercent ?? 30),
    weeklyEnabled: classroom?.weeklyDeposit != null,
    weeklyAmount: String(
      classroom?.weeklyDeposit
        ? classroom.weeklyDeposit.amountCents / 100
        : 100,
    ),
    weeklyDay: classroom?.weeklyDeposit?.day ?? "Monday",
    startDate: classroom?.startDate ?? "",
    endDate: classroom?.endDate ?? "",
  };
}

// Store money as cents; reject exponent notation, fractions of a cent, and unsafe amounts.
export function parseMoney(value: string): number | null {
  const text = value.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return null;
  const [whole, fraction = ""] = text.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) && cents > 0 && cents <= 100_000_000
    ? cents
    : null;
}

export function symbolsFrom(value: string): string[] {
  return [
    ...new Set(
      value
        .toUpperCase()
        .split(/[\s,]+/)
        .filter(Boolean),
    ),
  ];
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

export function validateTeacher(draft: SetupDraft): Errors {
  const errors: Errors = {};
  if (
    draft.teacherName.trim().length < 2 ||
    draft.teacherName.trim().length > 80
  )
    errors.teacherName = "Enter a name between 2 and 80 characters.";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim()) ||
    draft.email.trim().length > 254
  )
    errors.email = "Enter a valid email address for the preview.";
  return errors;
}

export function validateClass(draft: SetupDraft): Errors {
  const errors: Errors = {};
  if (draft.className.trim().length < 2 || draft.className.trim().length > 80)
    errors.className = "Give your class a name between 2 and 80 characters.";
  if (parseMoney(draft.startingCash) === null)
    errors.startingCash =
      "Enter an amount from $0.01 to $1,000,000, with up to two decimal places.";
  if (draft.investmentAccess !== "all" && draft.investmentAccess !== "approved")
    errors.investmentAccess = "Choose an investment access option.";
  if (draft.investmentAccess === "approved") {
    const symbols = symbolsFrom(draft.approvedSymbols);
    if (
      !symbols.length ||
      symbols.length > 100 ||
      symbols.some((symbol) => !/^[A-Z][A-Z0-9.-]{0,9}$/.test(symbol))
    ) {
      errors.approvedSymbols =
        "Enter 1–100 ticker symbols, separated by commas or spaces.";
    }
  }
  if (
    draft.limitPosition &&
    (!/^\d+$/.test(draft.positionLimit) ||
      Number(draft.positionLimit) < 1 ||
      Number(draft.positionLimit) > 100)
  )
    errors.positionLimit = "Choose a whole percentage from 1 to 100.";
  if (draft.weeklyEnabled && parseMoney(draft.weeklyAmount) === null)
    errors.weeklyAmount = "Enter a weekly amount from $0.01 to $1,000,000.";
  if (draft.weeklyEnabled && !WEEKDAYS.includes(draft.weeklyDay))
    errors.weeklyDay = "Choose a day of the week.";
  if (draft.startDate && !validDate(draft.startDate))
    errors.startDate = "Choose a valid start date.";
  if (draft.endDate && !validDate(draft.endDate))
    errors.endDate = "Choose a valid end date.";
  if (
    draft.startDate &&
    draft.endDate &&
    !errors.startDate &&
    !errors.endDate &&
    draft.endDate < draft.startDate
  )
    errors.endDate = "The end date must be on or after the start date.";
  return errors;
}

export function settingsFrom(draft: SetupDraft): ClassSettings {
  if (Object.keys(validateClass(draft)).length)
    throw new Error("Class settings are incomplete.");
  return {
    name: draft.className.trim(),
    startingCashCents: parseMoney(draft.startingCash)!,
    investmentAccess: draft.investmentAccess,
    approvedSymbols:
      draft.investmentAccess === "approved"
        ? symbolsFrom(draft.approvedSymbols)
        : [],
    tradingEnabled: draft.tradingEnabled,
    positionLimitPercent: draft.limitPosition
      ? Number(draft.positionLimit)
      : null,
    weeklyDeposit: draft.weeklyEnabled
      ? { amountCents: parseMoney(draft.weeklyAmount)!, day: draft.weeklyDay }
      : null,
    startDate: draft.startDate,
    endDate: draft.endDate,
  };
}

export function createClass(
  settings: ClassSettings,
  existing: Classroom[],
  now = new Date(),
): Classroom {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code: string;
  do {
    code = Array.from(
      crypto.getRandomValues(new Uint8Array(8)),
      (byte) => alphabet[byte % alphabet.length],
    ).join("");
  } while (existing.some((classroom) => classroom.code === code));
  return {
    ...settings,
    id: crypto.randomUUID(),
    code,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

export function updateClass(
  existing: Classroom,
  settings: ClassSettings,
  now = new Date(),
): Classroom {
  return { ...existing, ...settings, updatedAt: now.toISOString() };
}

export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 ? 2 : 0,
  }).format(cents / 100);
export const displayDate = (date: string) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeZone: "UTC",
      }).format(new Date(`${date}T00:00:00Z`))
    : "Not set";
