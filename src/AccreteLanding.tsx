import { useEffect, useState } from 'react';
import type { PointerEvent } from 'react';
import SeedLogo from './SeedLogo';

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
    <div className="stage-halo" aria-hidden="true"/>
    <img className="stage-art" src="/accrete-seed-art.webp" alt="" width="768" height="1152" fetchPriority="high"/>
    <div className="stage-orbit stage-orbit-one" aria-hidden="true"/><div className="stage-orbit stage-orbit-two" aria-hidden="true"/>
    <div className="market-sheet" aria-hidden="true"><div className="market-sheet-head"><span>Company signals</span><span className="market-sheet-arrow"><Arrow/></span></div><div className="market-bars"><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="market-sheet-foot"><span>What changed?</span><span>Look closer</span></div></div>
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
    <div className="research-sheet" aria-hidden="true"><span className="research-sheet-mark"><SeedLogo/></span><div><strong>Look beyond the headline</strong><small>Products · Earnings · Industry</small></div><span>03 / 03</span></div>
    <div className="stage-caption">Illustrative interaction · No market advice or live data</div>
  </div>;
}

export default function AccreteLanding({ returning }: { returning: boolean }) {
  const [motionPaused, setMotionPaused] = useState(false);
  useEffect(() => {
    const target = document.querySelector('.accrete-story-visual');
    if (!target) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { target.classList.add('is-visible'); return; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { target.classList.add('is-visible'); observer.disconnect(); } }, { threshold: .2 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  const moveScene = (event: PointerEvent<HTMLElement>) => {
    if (motionPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 18}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height - .5) * 18}px`);
  };
  return <main className="accrete-landing">
    <section className={`accrete-hero${motionPaused ? ' motion-paused' : ''}`} aria-labelledby="hero-heading" onPointerMove={moveScene}><div className="accrete-hero-inner">
      <div className="accrete-hero-copy"><h1 id="hero-heading">See past<br/>the price.</h1><p>Learn investing by looking closer, making a decision, and seeing how it plays out. Built for students and their classrooms.</p><div className="accrete-actions"><a className="accrete-primary" href={returning ? '#/teacher' : '#/teacher/setup'}>{returning ? 'Open your workspace' : 'Create a class'}<Arrow/></a><button className="accrete-secondary" type="button" onClick={scrollToExperience}>See how it works<Arrow down/></button></div><span className="accrete-truth">Real companies. Virtual money. Room to learn.</span></div>
      <DecisionPreview/>
    </div><div className="hero-bottom-line"><span>Knowledge grows when you look closer.</span><button type="button" className="motion-toggle" aria-pressed={motionPaused} onClick={() => setMotionPaused(!motionPaused)}>{motionPaused ? 'Play motion' : 'Pause motion'}</button><span>Explore the experience <Arrow down/></span></div></section>
    <section className="accrete-experience" aria-labelledby="experience"><div className="experience-heading"><h2 id="experience" tabIndex={-1}>From a clue to a decision.</h2><p>Accrete connects what students discover with what they choose to do. The first version of this experience is being built now.</p></div>
      <div className="accrete-story-visual" aria-label="Illustration of research, a decision, and its outcome">
        <div className="story-light" aria-hidden="true"/><div className="story-ring story-ring-one" aria-hidden="true"/><div className="story-ring story-ring-two" aria-hidden="true"/>
        <div className="story-panel story-panel-left"><span className="story-panel-label">Research</span><h3>What is behind this company?</h3><div className="story-fact"><EvidenceIcon kind="products"/>Products</div><div className="story-fact"><EvidenceIcon kind="earnings"/>Earnings</div><div className="story-fact"><EvidenceIcon kind="industry"/>Industry</div></div>
        <div className="story-panel story-panel-center"><span className="story-panel-label">Your move</span><div className="story-center-mark"><SeedLogo/></div><strong>Look closer.<br/>Then decide.</strong><div className="story-choice"><span>Buy</span><span>Hold</span><span>Sell</span></div></div>
        <div className="story-panel story-panel-right"><span className="story-panel-label">What follows</span><h3>Watch the choice unfold.</h3><svg viewBox="0 0 240 100" role="img" aria-label="Illustrative outcome path"><path d="M4 75 C30 63 45 85 70 60 S115 64 137 38 S186 55 207 17 L236 26" fill="none" stroke="#08c98a" strokeWidth="5" strokeLinecap="round"/></svg><small>Illustrative path, not market data</small></div>
      </div>
      <div className="experience-flow"><article><span>Explore</span><h3>Find the story behind a company.</h3><p>Look into its products, business, and the market around it.</p></article><article><span>Decide</span><h3>Make a move with a reason.</h3><p>Buy, sell, or hold in a situation where the information matters.</p></article><article><span>Reflect</span><h3>See what happened next.</h3><p>Follow the outcome and revisit the evidence available at the time.</p></article></div></section>
    <section className="accrete-teacher"><div><h2>Bring the market into your classroom.</h2><p>Start with a virtual budget, set the boundaries for your class, and give students a place to practice making decisions.</p></div><div><a className="accrete-primary" href="#/teacher/setup">Try teacher setup<Arrow/></a><small>Local design preview. No real account is created.</small></div></section>
  </main>;
}
