import { useState } from "react";
import ConceptScene, { type SceneKind } from "./ConceptScene";
import { Arrow, PortfolioPreview } from "./Landing";
import { Atmosphere } from "./Motion";
import "./concepts.css";

const concepts = [
  {
    id: "sculpture",
    name: "A world of possibility",
    category: "Cinematic sculpture",
    description:
      "An original emerald sculpture. Quiet typography, studio light, and a slowly changing perspective.",
    action: "Explore concept A",
    letter: "A",
  },
  {
    id: "decision",
    name: "The next move is yours",
    category: "Interactive decision",
    description:
      "Pause a moving scene. Make a choice. Watch the direction change. An introduction built around agency.",
    action: "Explore concept B",
    letter: "B",
  },
  {
    id: "world",
    name: "Look a little closer",
    category: "Miniature world",
    description:
      "Explore a small world of connected businesses. Select a place and follow its connections.",
    action: "Explore concept C",
    letter: "C",
  },
] as const;

export function ConceptIndex() {
  return (
    <main className="concept-index">
      <div className="concept-index-intro">
        <h1>
          Three ways
          <br />
          into Reign.
        </h1>
        <p>
          Same purpose. Three different first impressions.
          <br />
          Open each concept to see it move and try the interaction.
        </p>
      </div>
      <div className="concept-choices">
        {concepts.map((concept) => (
          <a
            className={`concept-choice choice-${concept.id}`}
            href={`#/concept/${concept.id}`}
            key={concept.id}
          >
            <div className="concept-letter" aria-hidden="true">
              {concept.letter}
              <span />
            </div>
            <div className="concept-choice-copy">
              <p>{concept.category}</p>
              <h2>{concept.name}</h2>
              <p>{concept.description}</p>
              <span className="concept-open">
                {concept.action}
                <Arrow />
              </span>
            </div>
          </a>
        ))}
      </div>
      <p className="concept-review-note">
        Design explorations for review. Nothing has been selected for the final
        site. The portfolio preview sits below each hero.
      </p>
    </main>
  );
}
function StartLink({ returning }: { returning: boolean }) {
  return (
    <a
      className="button primary"
      href={returning ? "#/teacher" : "#/teacher/setup"}
    >
      {returning ? "Open your workspace" : "Create your class"}
      <Arrow />
    </a>
  );
}
function ConceptNav({ kind }: { kind: SceneKind }) {
  return (
    <nav className="concept-switcher" aria-label="Hero concepts">
      <a href="#/concepts">All concepts</a>
      <div>
        {concepts.map((concept) => (
          <a
            href={`#/concept/${concept.id}`}
            key={concept.id}
            aria-current={kind === concept.id ? "page" : undefined}
          >
            {concept.letter}
            <span> · {concept.category}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
function Sculpture({ returning }: { returning: boolean }) {
  const [turn, setTurn] = useState(0);
  return (
    <section className="sculpture-hero" aria-labelledby="concept-title">
      <Atmosphere />
      <div className="sculpture-heading">
        <h1 id="concept-title">
          A world of possibility.
          <br />A choice that’s yours.
        </h1>
        <p>
          Explore investing with your class.
          <br />
          Real companies. Virtual money. Your decisions.
        </p>
      </div>
      <ConceptScene kind="sculpture" turn={turn} />
      <div className="sculpture-bottom">
        <span>
          Different paths.
          <br />
          Your own perspective.
        </span>
        <StartLink returning={returning} />
        <button
          className="scene-control"
          onClick={() => setTurn((value) => value + 1)}
        >
          Another perspective
          <Arrow />
        </button>
      </div>
    </section>
  );
}
function Decision({ returning }: { returning: boolean }) {
  const [phase, setPhase] = useState<"flow" | "choose" | "result">("flow");
  const [selection, setSelection] = useState(0);
  return (
    <section
      className={`decision-hero decision-${phase}`}
      aria-labelledby="concept-title"
    >
      <div className="decision-intro">
        <h1 id="concept-title">
          What happens next
          <br />
          starts with you.
        </h1>
        <p>
          Investing is full of decisions.
          <br />
          Reign gives your class a place to make them.
        </p>
      </div>
      <div className="decision-stage">
        <ConceptScene
          kind="decision"
          selection={selection}
          frozen={phase === "choose"}
        />
        <div className="decision-center" aria-live="polite">
          <span className="scene-status">
            {phase === "flow"
              ? "A moment of possibility"
              : phase === "choose"
                ? "Time is yours"
                : "A different direction"}
          </span>
          <p>
            {phase === "flow"
              ? "Everything moves. Until you pause."
              : phase === "choose"
                ? "Which path will you take?"
                : selection === 0
                  ? "You stayed the course. Follow the light."
                  : "You changed direction. Follow the light."}
          </p>
        </div>
      </div>
      <div className="decision-controls">
        {phase === "flow" ? (
          <button className="button primary" onClick={() => setPhase("choose")}>
            Pause the moment
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M3 2h3v12H3zm7 0h3v12h-3z" />
            </svg>
          </button>
        ) : phase === "choose" ? (
          <div className="decision-options">
            <button
              className="button primary"
              onClick={() => {
                setSelection(0);
                setPhase("result");
              }}
            >
              Stay the course
              <Arrow />
            </button>
            <button
              className="button primary"
              onClick={() => {
                setSelection(1);
                setPhase("result");
              }}
            >
              Change direction
              <Arrow />
            </button>
          </div>
        ) : (
          <div className="decision-options">
            <StartLink returning={returning} />
            <button className="scene-control" onClick={() => setPhase("flow")}>
              Try the other path
              <Arrow />
            </button>
          </div>
        )}
        <p className="concept-disclosure">
          An interaction study, not an investing lesson. No right answer or
          financial outcome.
        </p>
      </div>
      {phase !== "result" && (
        <a
          className="decision-skip"
          href={returning ? "#/teacher" : "#/teacher/setup"}
        >
          Go straight to teacher setup
          <Arrow />
        </a>
      )}
    </section>
  );
}
const businesses = [
  "Product studio",
  "Materials",
  "Energy",
  "Logistics",
  "Retail",
  "Workshop",
];
function World({ returning }: { returning: boolean }) {
  const [selection, setSelection] = useState(0);
  const [turn, setTurn] = useState(0);
  return (
    <section className="world-hero" aria-labelledby="concept-title">
      <div className="world-intro">
        <h1 id="concept-title">
          There’s a world
          <br />
          behind every choice.
        </h1>
        <div>
          <p>
            Get curious. Look closer.
            <br />
            Discover investing with your class.
          </p>
          <StartLink returning={returning} />
        </div>
      </div>
      <div className="world-stage">
        <ConceptScene kind="world" selection={selection} turn={turn} />
        <button
          className="world-rotate scene-control"
          onClick={() => setTurn((value) => value + 1)}
        >
          Rotate the world
          <Arrow />
        </button>
      </div>
      <div className="world-explorer">
        <div className="world-selection">
          <p>Choose a place to explore</p>
          <div role="group" aria-label="Fictional businesses">
            {businesses.map((name, index) => (
              <button
                key={name}
                aria-pressed={selection === index}
                onClick={() => setSelection(index)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="world-caption" aria-live="polite">
          <h2>{businesses[selection]}</h2>
          <p>Follow its illuminated connection through the scene.</p>
          <small>
            Fictional businesses for this visual concept. Not market research.
          </small>
        </div>
      </div>
    </section>
  );
}
export function HeroConcept({
  kind,
  returning,
}: {
  kind: SceneKind;
  returning: boolean;
}) {
  return (
    <main className={`concept-page concept-${kind}`}>
      <ConceptNav kind={kind} />
      {kind === "sculpture" ? (
        <Sculpture returning={returning} />
      ) : kind === "decision" ? (
        <Decision returning={returning} />
      ) : (
        <World returning={returning} />
      )}
      <section
        className="concept-product"
        aria-labelledby="concept-product-title"
      >
        <div>
          <h2 id="concept-product-title">
            The experience
            <br />
            behind the first impression.
          </h2>
          <p>
            Build a virtual portfolio, explore decisions, and learn alongside
            your class.
          </p>
          <p className="concept-product-note">
            This sample shows the visual direction. Student trading, lessons,
            and class games are still being built.
          </p>
          <a className="text-button" href="#/concepts">
            Compare the other concepts
            <Arrow back />
          </a>
        </div>
        <div>
          <PortfolioPreview />
          <p className="concept-disclosure">
            Illustrative values, not live market data.
          </p>
        </div>
      </section>
    </main>
  );
}
