import { useState } from 'react';
import SeedLogo from './SeedLogo';
import './moment.css';

export function Arrow({ down = false, back = false }: { down?: boolean; back?: boolean }) {
  return <svg className="arrow-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d={back ? 'M20 12H4m6-6-6 6 6 6' : down ? 'M12 4v16m-6-6 6 6 6-6' : 'M5 12h14m-6-6 6 6-6 6'}/></svg>;
}

export function scrollToExperience() {
  const target = document.getElementById('experience');
  target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
  target?.focus({ preventScroll: true });
}

const signals = {
  Earnings: {
    title: 'A stronger quarter. A closer question.',
    detail: 'Revenue is rising, but margins add context to the story.',
    path: 'M0 82 C33 78 44 68 70 72 S109 55 140 62 S182 36 211 42 S258 29 290 24',
  },
  Products: {
    title: 'What is the company building?',
    detail: 'Look at the products and the people who need them.',
    path: 'M0 85 C31 77 58 81 82 62 S130 68 158 48 S212 57 240 35 S274 28 290 18',
  },
  Industry: {
    title: 'The wider picture matters.',
    detail: 'A company moves inside a market that is changing too.',
    path: 'M0 82 C28 82 45 58 73 65 S120 55 146 57 S185 29 211 36 S264 31 290 16',
  },
} as const;
type Signal = keyof typeof signals;
type Decision = 'Buy' | 'Hold' | 'Sell';

const muralTiles = [
  { src: '/moment-mural-01.webp', height: 1330 },
  { src: '/moment-mural-02.webp', height: 1331 },
  { src: '/moment-mural-03.webp', height: 1330 },
  { src: '/moment-mural-04.webp', height: 1330 },
  { src: '/moment-mural-05.webp', height: 1330 },
  { src: '/moment-mural-06.webp', height: 1331 },
  { src: '/moment-mural-07.webp', height: 1330 },
] as const;

function ProductPreview() {
  const [signal, setSignal] = useState<Signal>('Earnings');
  const [decision, setDecision] = useState<Decision | null>(null);
  const current = signals[signal];

  return <div className="moment-preview" id="experience" tabIndex={-1} aria-label="Interactive MOMENT product preview">
    <div className="moment-preview-bar"><span className="moment-preview-brand"><SeedLogo/>MOMENT <i/> Explore</span><span className="moment-preview-mode">Practice portfolio</span></div>
    <div className="moment-preview-body">
      <div className="moment-preview-intro"><h2>Look Beyond the Price.</h2><p>Choose a signal to see more of the company.</p><div className="moment-signal-list" role="group" aria-label="Explore company evidence">{(Object.keys(signals) as Signal[]).map((item) => <button key={item} type="button" aria-pressed={signal === item} className={signal === item ? 'is-selected' : ''} onClick={() => setSignal(item)}>{item}</button>)}</div></div>
      <div className="moment-preview-detail"><span className="moment-preview-note">Illustrative company view</span><h3>{current.title}</h3><p>{current.detail}</p><div className="moment-preview-chart" role="img" aria-label="Illustrative trend, not market data"><svg viewBox="0 0 290 100" preserveAspectRatio="none" aria-hidden="true"><path d={current.path} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg></div><div className="moment-preview-choice"><span>What would you do?</span><div role="group" aria-label="Choose a virtual practice decision">{(['Buy', 'Hold', 'Sell'] as Decision[]).map((item) => <button key={item} type="button" aria-pressed={decision === item} className={decision === item ? 'is-selected' : ''} onClick={() => setDecision(item)}>{item}</button>)}</div><p aria-live="polite">{decision ? `${decision} selected for this practice view.` : 'Virtual decisions only.'}</p></div></div>
    </div>
  </div>;
}

export default function Landing({ returning }: { returning: boolean }) {
  return <main className="moment-landing">
    <div className="moment-mural" aria-hidden="true">
      {muralTiles.map((tile, index) => <img key={tile.src} src={tile.src} alt="" width="1882" height={tile.height} loading={index < 2 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async"/>)}
    </div>
    <div className="moment-foreground">
      <section className="moment-hero" aria-labelledby="hero-heading"><div><h1 id="hero-heading"><span>See Past</span><span>The Price.</span></h1><p>Discover the story behind a company before you decide what to do next.</p><div className="moment-hero-actions"><a className="moment-primary" href={returning ? '#/teacher' : '#/teacher/setup'}>{returning ? 'Open your workspace' : 'Create a class'}<Arrow/></a><button className="moment-explore" type="button" onClick={scrollToExperience}>Explore the preview<Arrow down/></button></div></div></section>
      <section className="moment-showcase" aria-label="MOMENT product preview"><ProductPreview/></section>
    </div>
  </main>;
}
