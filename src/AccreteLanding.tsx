import { useState } from 'react';

export function Arrow({ down = false, back = false }: { down?: boolean; back?: boolean }) {
  return <svg className="arrow-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d={back ? 'M20 12H4m6-6-6 6 6 6' : down ? 'M12 4v16m-6-6 6 6 6-6' : 'M5 12h14m-6-6 6 6-6 6'}/></svg>;
}

export function scrollToExperience() {
  const target = document.getElementById('experience');
  target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  target?.focus({ preventScroll: true });
}

const decisions = {
  buy: 'You chose to invest more. What evidence would you check before deciding how much?',
  hold: 'You chose to wait. What new information might change your view?',
  sell: 'You chose to reduce your position. Which risk matters most to you?',
} as const;
type Decision = keyof typeof decisions;

function EvidenceIcon({ kind }: { kind: 'earnings' | 'products' | 'industry' }) {
  const paths = { earnings: 'M4 19v-5m5 5V9m5 10V5m5 14v-8', products: 'm12 2 9 5-9 5-9-5 9-5Zm-9 5v10l9 5 9-5V7M12 12v10', industry: 'm12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5' };
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[kind]}/></svg>;
}

function DecisionPreview() {
  const [decision, setDecision] = useState<Decision | null>(null);
  return <div className="accrete-stage" aria-label="Illustrative investing situation">
    <div className="stage-orbit stage-orbit-one" aria-hidden="true"/><div className="stage-orbit stage-orbit-two" aria-hidden="true"/>
    <div className="evidence-stack" aria-hidden="true">
      <div className="evidence-card evidence-one"><EvidenceIcon kind="earnings"/><span>Earnings</span><i/></div>
      <div className="evidence-card evidence-two"><EvidenceIcon kind="products"/><span>Products</span><i/></div>
      <div className="evidence-card evidence-three"><EvidenceIcon kind="industry"/><span>Industry</span><i/></div>
    </div>
    <div className="situation-card">
      <div className="situation-top"><span className="situation-dot"/>Practice situation <span className="situation-time">Market paused</span></div>
      <h2>A company you own just reported a change.</h2>
      <p>Look beyond the price. What would you do next?</p>
      <div className="situation-evidence"><span>Earnings</span><span>Products</span><span>Industry</span></div>
      <div className="situation-actions" role="group" aria-label="Choose a practice decision">
        {(Object.keys(decisions) as Decision[]).map((key) => <button type="button" key={key} className={decision === key ? 'selected' : ''} aria-pressed={decision === key} onClick={() => setDecision(key)}>{key[0].toUpperCase() + key.slice(1)}</button>)}
      </div>
      <p className="decision-response" aria-live="polite">{decision ? decisions[decision] : 'Choose a path to explore the decision.'}</p>
    </div>
    <div className="stage-caption">Illustrative interaction · No market advice or live data</div>
  </div>;
}

export default function AccreteLanding({ returning }: { returning: boolean }) {
  return <main className="accrete-landing">
    <section className="accrete-hero" aria-labelledby="hero-heading"><div className="accrete-hero-inner">
      <div className="accrete-hero-copy"><h1 id="hero-heading">See past<br/>the price.</h1><p>Learn investing by looking closer, making a decision, and seeing how it plays out. Built for students and their classrooms.</p><div className="accrete-actions"><a className="accrete-primary" href={returning ? '#/teacher' : '#/teacher/setup'}>{returning ? 'Open your workspace' : 'Create a class'}<Arrow/></a><button className="accrete-secondary" type="button" onClick={scrollToExperience}>See how it works<Arrow down/></button></div><span className="accrete-truth">Real companies. Virtual money. Room to learn.</span></div>
      <DecisionPreview/>
    </div><div className="hero-bottom-line"><span>Knowledge grows when you look closer.</span><span>Explore the experience <Arrow down/></span></div></section>
    <section className="accrete-experience" aria-labelledby="experience"><div className="experience-heading"><h2 id="experience" tabIndex={-1}>From a clue to a decision.</h2><p>Accrete connects what students discover with what they choose to do. The first version of this experience is being built now.</p></div><div className="experience-flow"><article><span>Explore</span><h3>Find the story behind a company.</h3><p>Look into its products, business, and the market around it.</p></article><article><span>Decide</span><h3>Make a move with a reason.</h3><p>Buy, sell, or hold in a situation where the information matters.</p></article><article><span>Reflect</span><h3>See what happened next.</h3><p>Follow the outcome and revisit the evidence available at the time.</p></article></div></section>
    <section className="accrete-teacher"><div><h2>Bring the market into your classroom.</h2><p>Start with a virtual budget, set the boundaries for your class, and give students a place to practice making decisions.</p></div><div><a className="accrete-primary" href="#/teacher/setup">Try teacher setup<Arrow/></a><small>Local design preview. No real account is created.</small></div></section>
  </main>;
}
