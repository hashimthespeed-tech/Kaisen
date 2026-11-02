import { useId, useState } from "react";
import { money } from "./model";

export function Arrow({
  down = false,
  back = false,
}: {
  down?: boolean;
  back?: boolean;
}) {
  return (
    <svg
      className="arrow-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path
        d={
          back
            ? "M20 12H4m6-6-6 6 6 6"
            : down
              ? "M12 4v16m-6-6 6 6 6-6"
              : "M6 18 18 6M6 6h12v12"
        }
      />
    </svg>
  );
}

export function scrollToExperience() {
  const target = document.getElementById("experience");
  target?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
    block: "start",
  });
  target?.focus({ preventScroll: true });
}

const samples = {
  "1W": {
    label: "one week",
    values: [10410, 10378, 10435, 10422, 10396, 10430, 10482],
    start: "Monday",
    end: "Sunday",
  },
  "1M": {
    label: "one month",
    values: [
      10000, 10060, 10018, 10120, 10080, 10230, 10160, 10195, 10320, 10285,
      10410, 10482,
    ],
    start: "Day 1",
    end: "Day 30",
  },
  "3M": {
    label: "three months",
    values: [
      9800, 9900, 9850, 10010, 9950, 10090, 10030, 10120, 10220, 10110, 10300,
      10482,
    ],
    start: "Month 1",
    end: "Month 3",
  },
} as const;

function PortfolioPreview() {
  const [period, setPeriod] = useState<keyof typeof samples>("1M");
  const id = useId();
  const { values, label, start, end } = samples[period];
  const balance = values[values.length - 1];
  const change = balance - values[0];
  const minimum = Math.min(...values) - 90;
  const maximum = Math.max(...values) + 90;
  const coordinates = values.map(
    (value, index) =>
      `${16 + (index * 468) / (values.length - 1)},${185 - ((value - minimum) * 155) / (maximum - minimum)}`,
  );
  const line = `M ${coordinates.join(" L ")}`;
  const percent = ((change / values[0]) * 100).toFixed(2);
  return (
    <div className="portfolio-preview">
      <div className="portfolio-preview-heading">
        <span>Your portfolio</span>
        <span className="sample-label">Sample data</span>
      </div>
      <div className="portfolio-overview">
        <div>
          <p className="portfolio-value">{money(balance * 100)}</p>
          <p className="portfolio-gain" aria-live="polite">
            +{money(change * 100)}{" "}
            <span>
              ({percent}%) over {label}
            </span>
          </p>
        </div>
        <div
          className="chart-periods"
          role="group"
          aria-label="Sample portfolio time range"
        >
          {(Object.keys(samples) as (keyof typeof samples)[]).map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`Show ${samples[value].label}`}
              aria-pressed={value === period}
              onClick={() => setPeriod(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <svg
        className="portfolio-chart"
        viewBox="0 0 500 210"
        role="img"
        aria-labelledby={`${id}-title ${id}-description`}
      >
        <title id={`${id}-title`}>Illustrative portfolio over {label}</title>
        <desc id={`${id}-description`}>
          A fictional portfolio fluctuates from {money(values[0] * 100)} to{" "}
          {money(balance * 100)}. These are sample values, not market data or a
          prediction.
        </desc>
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4baf8a" stopOpacity=".2" />
            <stop offset="100%" stopColor="#4baf8a" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[45, 100, 155].map((y) => (
          <line
            key={y}
            x1="16"
            y1={y}
            x2="484"
            y2={y}
            stroke="var(--line)"
            strokeDasharray="3 6"
          />
        ))}
        <path d={`${line} L 484,202 L 16,202 Z`} fill={`url(#${id}-fill)`} />
        <path
          key={period}
          className="chart-line"
          d={line}
          fill="none"
          stroke="#25765c"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength="1"
        />
        <circle
          cx="484"
          cy={coordinates[coordinates.length - 1].split(",")[1]}
          r="4"
          fill="#25765c"
        />
      </svg>
      <div className="chart-axis" aria-hidden="true">
        <span>{start}</span>
        <span>{end}</span>
      </div>
      <dl className="portfolio-breakdown">
        <div>
          <dt>Invested</dt>
          <dd>{money(798200)}</dd>
        </div>
        <div>
          <dt>Available cash</dt>
          <dd>{money(250000)}</dd>
        </div>
      </dl>
      <details className="chart-data">
        <summary>View sample values</summary>
        <table>
          <caption>Illustrative values over {label}</caption>
          <thead>
            <tr>
              <th scope="col">Point</th>
              <th scope="col">Portfolio value</th>
            </tr>
          </thead>
          <tbody>
            {values.map((value, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{money(value * 100)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

export default function Landing({ returning }: { returning: boolean }) {
  return (
    <main className="landing">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-layout">
          <div className="hero-content">
            <h1 id="hero-heading">Investing, learned by doing.</h1>
            <p>
              A stock market for your classroom. Invest virtual money, follow
              real companies, and learn from the decisions you make.
            </p>
            <div className="hero-actions">
              <a
                className="button primary"
                href={returning ? "#/teacher" : "#/teacher/setup"}
              >
                {returning ? "Open your workspace" : "Create your class"}
                <Arrow />
              </a>
              <button
                type="button"
                className="hero-explore"
                onClick={scrollToExperience}
              >
                See how it works
                <Arrow down />
              </button>
            </div>
            <p className="hero-note">
              Real companies. Virtual money. Your decisions.
            </p>
          </div>
          <figure className="hero-product">
            <PortfolioPreview />
            <figcaption>
              A look at the student experience. Illustrative values, not live
              market data.
            </figcaption>
          </figure>
        </div>
        <div className="hero-foot">
          <span>Made for the classroom.</span>
          <p>A place to try, get it wrong, and try again.</p>
          <span className="hero-foot-mark" aria-hidden="true">
            <Arrow down />
          </span>
        </div>
      </section>
      <section className="experience-section" aria-labelledby="experience">
        <div className="section-intro">
          <h2 id="experience" tabIndex={-1}>
            More than watching
            <br className="desktop-break" /> a number go up.
          </h2>
          <p>
            Reign brings investing into the classroom through portfolios,
            situations, and decisions you can talk about together.
          </p>
        </div>
        <div className="experience-columns">
          <article>
            <h3>Make it your portfolio.</h3>
            <p>
              Choose companies, make virtual investments, and follow how your
              choices unfold.
            </p>
            <span className="feature-caption">Your own starting point</span>
          </article>
          <article>
            <h3>Meet the moment.</h3>
            <p>
              Step into a market situation. Look at the information, make your
              decision, then see what happens next.
            </p>
            <span className="feature-caption">Learning through decisions</span>
          </article>
          <article>
            <h3>Bring the class along.</h3>
            <p>
              Play together, discuss your choices, and discover how others
              approached the same situation.
            </p>
            <span className="feature-caption">A shared experience</span>
          </article>
        </div>
        <p className="experience-disclaimer">
          This preview demonstrates the design and teacher setup. Student
          trading, lessons, and class games are still being built.
        </p>
      </section>
      <section className="teacher-invitation">
        <div>
          <h2>
            Your class.
            <br />
            Your starting point.
          </h2>
          <p>
            Choose the virtual budget and which stocks students can explore.
            Keep things simple to start, then adjust your class settings as you
            go.
          </p>
        </div>
        <div className="teacher-invitation-action">
          <a className="button primary" href="#/teacher/setup">
            Try teacher setup
            <Arrow />
          </a>
          <p>No real account needed for this preview.</p>
        </div>
      </section>
    </main>
  );
}
