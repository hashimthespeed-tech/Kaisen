import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  createClass,
  displayDate,
  initialDraft,
  money,
  settingsFrom,
  updateClass,
  validateClass,
  validateTeacher,
  WEEKDAYS,
} from "./model";
import type {
  Classroom,
  ClassSettings,
  Errors,
  PrototypeStore,
  SetupDraft,
} from "./model";
import { loadStore, persistStore } from "./storage";

const go = (path: string) => {
  window.location.hash = path;
};
function Brand() {
  return (
    <a className="brand" href="#/" aria-label="Reign home">
      <span className="brand-mark">r.</span>reign
    </a>
  );
}
function Arrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M6 18 18 6M6 6h12v12" />
    </svg>
  );
}
function Summary({ settings }: { settings: ClassSettings }) {
  return (
    <dl className="summary">
      <div>
        <dt>Starting virtual cash</dt>
        <dd>
          {money(settings.startingCashCents)} <small>per student</small>
        </dd>
      </div>
      <div>
        <dt>Investment access</dt>
        <dd>
          {settings.investmentAccess === "all"
            ? "All supported stocks"
            : settings.approvedSymbols.join(", ")}
        </dd>
      </div>
      <div>
        <dt>Trading</dt>
        <dd>{settings.tradingEnabled ? "Enabled" : "Paused"}</dd>
      </div>
      <div>
        <dt>Single-stock limit</dt>
        <dd>
          {settings.positionLimitPercent === null
            ? "No limit"
            : `${settings.positionLimitPercent}% of portfolio`}
        </dd>
      </div>
      <div>
        <dt>Weekly virtual deposit</dt>
        <dd>
          {settings.weeklyDeposit
            ? `${money(settings.weeklyDeposit.amountCents)} · ${settings.weeklyDeposit.day}`
            : "Off"}
        </dd>
      </div>
      <div>
        <dt>Class dates</dt>
        <dd>
          {!settings.startDate && !settings.endDate
            ? "No dates set"
            : `${displayDate(settings.startDate)} → ${displayDate(settings.endDate)}`}
        </dd>
      </div>
    </dl>
  );
}

function Setup({
  store,
  existing,
  onSave,
}: {
  store: PrototypeStore | null;
  existing?: Classroom;
  onSave: (next: PrototypeStore) => void;
}) {
  const [draft, setDraft] = useState(() =>
    initialDraft(store?.teacher, existing),
  );
  const [step, setStep] = useState(existing || store ? 2 : 1);
  const [errors, setErrors] = useState<Errors>({});
  const [saveError, setSaveError] = useState("");
  const [advanced, setAdvanced] = useState(Boolean(existing));
  const busy = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [step]);
  const set = <K extends keyof SetupDraft>(key: K, value: SetupDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSaveError("");
  };
  const showErrors = (next: Errors) => {
    setErrors(next);
    if (
      Object.keys(next).some((key) =>
        [
          "positionLimit",
          "weeklyAmount",
          "weeklyDay",
          "startDate",
          "endDate",
        ].includes(key),
      )
    )
      setAdvanced(true);
    requestAnimationFrame(() =>
      document.getElementById(Object.keys(next)[0])?.focus(),
    );
  };
  const next = (event: FormEvent) => {
    event.preventDefault();
    const problems = step === 1 ? validateTeacher(draft) : validateClass(draft);
    if (Object.keys(problems).length) {
      showErrors(problems);
      return;
    }
    setErrors({});
    setStep(step + 1);
  };
  const save = () => {
    if (busy.current) return;
    busy.current = true;
    let saved = false;
    try {
      const profileErrors = validateTeacher(draft);
      if (Object.keys(profileErrors).length) {
        setStep(1);
        showErrors(profileErrors);
        return;
      }
      const settings = settingsFrom(draft);
      const classroom = existing
        ? updateClass(existing, settings)
        : createClass(settings, store?.classes ?? []);
      const nextStore: PrototypeStore = {
        version: 1,
        teacher: { name: draft.teacherName.trim(), email: draft.email.trim() },
        classes: existing
          ? store!.classes.map((c) => (c.id === existing.id ? classroom : c))
          : [...(store?.classes ?? []), classroom],
      };
      persistStore(window.localStorage, nextStore);
      saved = true;
      onSave(nextStore);
      go(`/teacher/class/${classroom.id}`);
    } catch {
      setSaveError(
        "Your class could not be saved in this browser. Check that browser storage is available, then try again. Your form is still here.",
      );
    } finally {
      if (!saved) busy.current = false;
    }
  };
  const field = (
    key: keyof SetupDraft,
    label: string,
    input: ReactNode,
    hint?: string,
  ) => (
    <div className="field">
      <label htmlFor={key}>{label}</label>
      {input}
      {hint && (
        <p className="hint" id={`${key}-hint`}>
          {hint}
        </p>
      )}
      {errors[key] && (
        <p className="error" id={`${key}-error`} role="alert">
          {errors[key]}
        </p>
      )}
    </div>
  );
  const attrs = (key: keyof SetupDraft) => ({
    id: key,
    name: key,
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": [
      ['email', 'startingCash', 'approvedSymbols'].includes(key) ? `${key}-hint` : '',
      errors[key] ? `${key}-error` : '',
    ].filter(Boolean).join(' ') || undefined,
  });
  const textInput = (
    key:
      | "teacherName"
      | "email"
      | "className"
      | "startingCash"
      | "approvedSymbols"
      | "positionLimit"
      | "weeklyAmount"
      | "startDate"
      | "endDate",
    options: {
      type?: string;
      placeholder?: string;
      autoComplete?: string;
      inputMode?: "decimal" | "numeric";
    } = {},
  ) => (
    <input
      {...attrs(key)}
      {...options}
      value={draft[key]}
      onChange={(event) => set(key, event.target.value)}
    />
  );
  return (
    <main className="setup-layout">
      <aside className="setup-story">
        <p className="eyebrow">A little setup. A lot of possibility.</p>
        <h1>
          Your classroom.
          <br /> Their first
          <br /> <em>investment.</em>
        </h1>
        <p>
          Give your students a place to make decisions, follow the market, and
          learn together.
        </p>
        <div className="growth-art" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="story-foot">
          <svg
            className="spark"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M16 1v30M1 16h30M5 5l22 22M5 27 27 5" />
          </svg>
          <span>
            Real decisions.
            <br />
            Virtual money.
          </span>
        </div>
      </aside>
      <section className="setup-form" aria-label="Teacher setup">
        <ol className="steps" aria-label="Setup progress">
          {["You", "Your class", "Review"].map((label, index) => (
            <li
              key={label}
              className={
                step === index + 1
                  ? "active"
                  : step > index + 1
                    ? "complete"
                    : ""
              }
              aria-current={step === index + 1 ? "step" : undefined}
            >
              <span>{step > index + 1 ? "✓" : `0${index + 1}`}</span>
              {label}
            </li>
          ))}
        </ol>
        <div className="form-heading">
          <p className="eyebrow">Step 0{step} / 03</p>
          <h2 ref={heading} tabIndex={-1}>
            {step === 1
              ? "First, a quick hello."
              : step === 2
                ? existing
                  ? "Make it your class."
                  : "Set the starting point."
                : "Looks like a good start."}
          </h2>
          <p>
            {step === 1
              ? "Add your details to try the teacher experience."
              : step === 2
                ? "A few simple choices. You can edit these later."
                : "Take a look before saving your class in this browser."}
          </p>
        </div>
        {step < 3 ? (
          <form onSubmit={next} noValidate>
            {step === 1 ? (
              <>
                {field(
                  "teacherName",
                  "Your name",
                  textInput("teacherName", {
                    placeholder: "e.g. Alex Morgan",
                    autoComplete: "name",
                  }),
                )}
                {field(
                  "email",
                  "Email address",
                  textInput("email", {
                    type: "email",
                    placeholder: "alex@example.com",
                    autoComplete: "email",
                  }),
                  "Use sample details if you prefer. No email will be sent.",
                )}
                <div className="note">
                  This is a local preview. It saves these details only in this
                  browser and does not create an account.
                </div>
              </>
            ) : (
              <>
                {field(
                  "className",
                  "Class name",
                  textInput("className", {
                    placeholder: "e.g. Economics · Period 3",
                    autoComplete: "off",
                  }),
                )}
                {field(
                  "startingCash",
                  "Starting virtual cash per student",
                  <div className="input-prefix">
                    <span aria-hidden="true">$</span>
                    {textInput("startingCash", { inputMode: "decimal" })}
                  </div>,
                  "The amount each student starts with. All money in Reign is virtual.",
                )}
                <fieldset className="access-options">
                  <legend>What can students invest in?</legend>
                  <label
                    className={
                      draft.investmentAccess === "all"
                        ? "option selected"
                        : "option"
                    }
                  >
                    <input
                      type="radio"
                      name="investmentAccess"
                      value="all"
                      checked={draft.investmentAccess === "all"}
                      onChange={() => set("investmentAccess", "all")}
                    />
                    <span>
                      <strong>All supported stocks</strong>
                      <small>Room to explore the available companies.</small>
                    </span>
                  </label>
                  <label
                    className={
                      draft.investmentAccess === "approved"
                        ? "option selected"
                        : "option"
                    }
                  >
                    <input
                      type="radio"
                      name="investmentAccess"
                      value="approved"
                      checked={draft.investmentAccess === "approved"}
                      onChange={() => set("investmentAccess", "approved")}
                    />
                    <span>
                      <strong>A list I choose</strong>
                      <small>Keep the choices focused for your class.</small>
                    </span>
                  </label>
                </fieldset>
                {draft.investmentAccess === "approved" &&
                  field(
                    "approvedSymbols",
                    "Approved ticker symbols",
                    textInput("approvedSymbols", {
                      placeholder: "e.g. AAPL, MSFT, GOOGL",
                    }),
                    "Separate symbols with commas. Availability will need a market-data connection.",
                  )}
                <button
                  className="disclosure"
                  type="button"
                  aria-expanded={advanced}
                  aria-controls="advanced-settings"
                  onClick={() => setAdvanced(!advanced)}
                >
                  More class settings{" "}
                  <span aria-hidden="true">{advanced ? "−" : "+"}</span>
                </button>
                <div
                  id="advanced-settings"
                  hidden={!advanced}
                  className="advanced"
                >
                  <label className="toggle">
                    <span>
                      <strong>Allow trading</strong>
                      <small>
                        Turn off to start the class with trading paused.
                      </small>
                    </span>
                    <input
                      type="checkbox"
                      checked={draft.tradingEnabled}
                      onChange={(event) =>
                        set("tradingEnabled", event.target.checked)
                      }
                    />
                  </label>
                  <label className="toggle">
                    <span>
                      <strong>Limit a single stock</strong>
                      <small>
                        Set a maximum percentage of a student's portfolio.
                      </small>
                    </span>
                    <input
                      type="checkbox"
                      checked={draft.limitPosition}
                      onChange={(event) =>
                        set("limitPosition", event.target.checked)
                      }
                    />
                  </label>
                  {draft.limitPosition &&
                    field(
                      "positionLimit",
                      "Maximum per stock (%)",
                      textInput("positionLimit", { inputMode: "numeric" }),
                    )}
                  <label className="toggle">
                    <span>
                      <strong>Add weekly virtual cash</strong>
                      <small>
                        Give everyone a regular amount to work with.
                      </small>
                    </span>
                    <input
                      type="checkbox"
                      checked={draft.weeklyEnabled}
                      onChange={(event) =>
                        set("weeklyEnabled", event.target.checked)
                      }
                    />
                  </label>
                  {draft.weeklyEnabled && (
                    <div className="field-row">
                      {field(
                        "weeklyAmount",
                        "Weekly amount ($)",
                        textInput("weeklyAmount", { inputMode: "decimal" }),
                      )}
                      {field(
                        "weeklyDay",
                        "Deposit day",
                        <select
                          {...attrs("weeklyDay")}
                          value={draft.weeklyDay}
                          onChange={(event) =>
                            set(
                              "weeklyDay",
                              event.target.value as SetupDraft["weeklyDay"],
                            )
                          }
                        >
                          {WEEKDAYS.map((day) => (
                            <option key={day}>{day}</option>
                          ))}
                        </select>,
                      )}
                    </div>
                  )}
                  <div className="field-row">
                    {field(
                      "startDate",
                      "Start date (optional)",
                      textInput("startDate", { type: "date" }),
                    )}
                    {field(
                      "endDate",
                      "End date (optional)",
                      textInput("endDate", { type: "date" }),
                    )}
                  </div>
                  <p className="hint">
                    These choices are saved for the preview. Trading rules and
                    scheduled deposits are not active yet.
                  </p>
                </div>
              </>
            )}
            <div className="form-actions">
              {step === 2 ? (
                <button
                  className="text-button"
                  type="button"
                  onClick={() => {
                    setErrors({});
                    setStep(1);
                  }}
                >
                  ← Back
                </button>
              ) : (
                <a className="text-button" href={store ? "#/teacher" : "#/"}>
                  ← Back
                </a>
              )}
              <button className="button primary" type="submit">
                {step === 1 ? "Continue" : "Review class"} <Arrow />
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="review-name">
              <span className="class-icon">
                <Arrow />
              </span>
              <div>
                <h3>{draft.className.trim()}</h3>
                <p>{draft.teacherName.trim()} · Teacher</p>
              </div>
            </div>
            <Summary settings={settingsFrom(draft)} />
            <p className="note">
              Your preview class stays on this device. Student joining, account
              login, and live trading come in later features.
            </p>
            {saveError && (
              <p className="error" role="alert">
                {saveError}
              </p>
            )}
            <div className="form-actions">
              <button className="text-button" onClick={() => setStep(2)}>
                ← Edit details
              </button>
              <button className="button primary" onClick={save}>
                {existing ? "Save changes" : "Create preview class"} <Arrow />
              </button>
            </div>
          </>
        )}
        <p className="setup-bottom">
          A classroom stock market. A safe place to start.
        </p>
      </section>
    </main>
  );
}

function Workspace({
  store,
  classroom,
}: {
  store: PrototypeStore;
  classroom?: Classroom;
}) {
  const [copyStatus, setCopyStatus] = useState("");
  useEffect(() => {
    setCopyStatus("");
  }, [classroom?.id]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(classroom!.code);
      setCopyStatus("Preview code copied.");
    } catch {
      setCopyStatus("Select the code above and copy it manually.");
    }
  };
  return (
    <main className="workspace">
      <div className="workspace-title">
        <div>
          <p className="eyebrow">
            Teacher workspace / {classroom ? "Your class" : "Overview"}
          </p>
          <h1>
            {classroom
              ? classroom.name
              : `Hello, ${store.teacher.name.split(" ")[0]}.`}
          </h1>
          <p>
            {classroom
              ? "Your starting point is saved. Make it your own as you go."
              : "A little space for every class you teach."}
          </p>
        </div>
        <a
          className="button secondary"
          href={classroom ? "#/teacher" : "#/teacher/setup"}
        >
          {classroom ? "All classes" : "Create another class"} <Arrow />
        </a>
      </div>
      {classroom ? (
        <div className="workspace-grid">
          <section className="class-panel">
            <div className="panel-heading">
              <h2>Class settings</h2>
              <a
                className="text-button"
                href={`#/teacher/class/${classroom.id}/edit`}
              >
                Edit settings <Arrow />
              </a>
            </div>
            <Summary settings={classroom} />
            <p className="hint">
              Settings saved locally. Trading restrictions and deposits will
              become active when those features are connected.
            </p>
          </section>
          <aside className="class-aside">
            <section className="code-panel">
              <p className="eyebrow">Your preview class code</p>
              <p className="class-code">{classroom.code}</p>
              <button className="button primary" onClick={copy}>
                Copy code{" "}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <rect x="8" y="8" width="12" height="12" rx="2" />
                  <path d="M15 8V4H4v11h4" />
                </svg>
              </button>
              <p className="copy-status" role="status">
                {copyStatus}
              </p>
              <p>This code is a preview. Students cannot join with it yet.</p>
            </section>
            <section className="student-panel">
              <div>
                <h2>Students</h2>
                <span className="count">0</span>
              </div>
              <p>
                A place for your class to grow.
                <br />
                Student joining is the next step.
              </p>
            </section>
          </aside>
        </div>
      ) : (
        <div className="class-list">
          {store.classes.map((item) => (
            <a
              className="class-card"
              key={item.id}
              href={`#/teacher/class/${item.id}`}
            >
              <span className="class-icon">
                <Arrow />
              </span>
              <h2>{item.name}</h2>
              <p>{money(item.startingCashCents)} starting cash · 0 students</p>
              <span className="text-button">
                Open class <Arrow />
              </span>
            </a>
          ))}
          {!store.classes.length && (
            <p>No classes yet. Create your first class to get started.</p>
          )}
        </div>
      )}
    </main>
  );
}

function Landing({ returning }: { returning: boolean }) {
  return (
    <main className="landing">
      <section className="hero">
        <div className="hero-lines" aria-hidden="true" />
        <p className="eyebrow">Invest in a little understanding.</p>
        <h1>
          The market is real.
          <br />
          The possibilities
          <br />
          <em>are yours.</em>
        </h1>
        <p className="hero-copy">
          A classroom stock market where students make the decisions. Build a
          portfolio, explore what happens, and learn together. All with virtual
          money.
        </p>
        <div className="hero-actions">
          <a
            className="button primary"
            href={returning ? "#/teacher" : "#/teacher/setup"}
          >
            {returning ? "Open your workspace" : "Create your class"} <Arrow />
          </a>
          <a className="hero-link" href="#/teacher/setup">
            {returning ? "Create another class" : "Try the teacher preview"}{" "}
            <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="hero-bottom">
          <span>Made for curious minds.</span>
          <span>Built around your classroom.</span>
        </div>
      </section>
      <section className="landing-intro">
        <p className="eyebrow">01 / A place to begin</p>
        <h2>
          Small decisions.
          <br />A bigger perspective.
        </h2>
        <p>
          Choose a starting balance and set the rules for your class. Your
          students' first steps start with you.
        </p>
      </section>
    </main>
  );
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || "/");
  const [loaded, setLoaded] = useState<{
    store: PrototypeStore | null;
    error: boolean;
  }>(() => {
    try {
      return { store: loadStore(window.localStorage), error: false };
    } catch {
      return { store: null, error: true };
    }
  });
  useEffect(() => {
    const change = () => {
      setRoute(window.location.hash.slice(1) || "/");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  const store = loaded.store;
  const classMatch = /^\/teacher\/class\/([^/]+)(\/edit)?$/.exec(route);
  const classroom = store?.classes.find((item) => item.id === classMatch?.[1]);
  const isSetup =
    route === "/teacher/setup" || Boolean(classroom && classMatch?.[2]);
  let content: ReactNode;
  if (loaded.error)
    content = (
      <main className="recovery">
        <p className="eyebrow">Your preview data</p>
        <h1>Let's keep your work safe.</h1>
        <p>
          Saved data could not be read, or browser storage is blocked. No saved
          data has been replaced. Enable browser storage and reload, or open
          this preview in a fresh browser profile.
        </p>
        <button
          className="button primary"
          onClick={() => window.location.reload()}
        >
          Reload preview <Arrow />
        </button>
      </main>
    );
  else if (route === "/") content = <Landing returning={Boolean(store)} />;
  else if (isSetup)
    content = (
      <Setup
        key={route}
        store={store}
        existing={classMatch?.[2] ? classroom : undefined}
        onSave={(next) => setLoaded({ store: next, error: false })}
      />
    );
  else if (store && route === "/teacher") content = <Workspace store={store} />;
  else if (store && classroom)
    content = <Workspace store={store} classroom={classroom} />;
  else
    content = (
      <main className="recovery">
        <p className="eyebrow">Teacher preview</p>
        <h1>
          {route === "/teacher"
            ? "Your classroom starts here."
            : "This page is not available."}
        </h1>
        <p>
          {route === "/teacher"
            ? "Create a local preview class to explore the teacher workspace."
            : "The class may be saved in another browser. Preview data stays on the device where you created it."}
        </p>
        <a
          className="button primary"
          href={store ? "#/teacher" : "#/teacher/setup"}
        >
          {store ? "Your classes" : "Start teacher setup"} <Arrow />
        </a>
      </main>
    );
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to content
      </a>
      <div className="prototype-bar">
        <span className="status-dot" /> Teacher preview{" "}
        <span className="bar-divider">/</span> Saved only in this browser · No
        real accounts
      </div>
      <header className="site-header">
        <Brand />
        <nav aria-label="Main navigation">
          <span className="nav-label">
            For the next generation of investors.
          </span>
          <a
            className="nav-tile"
            href={store ? "#/teacher" : "#/teacher/setup"}
          >
            {store ? "My classes" : "For teachers"} <Arrow />
          </a>
        </nav>
      </header>
      <div id="main-content" tabIndex={-1}>
        {content}
      </div>
      <footer className="site-footer">
        <Brand />
        <p>Real decisions. Virtual money.</p>
        <span>Teacher setup preview · 01</span>
      </footer>
    </>
  );
}
