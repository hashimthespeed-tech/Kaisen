import { useEffect, useRef, useState } from 'react';
import '@fontsource-variable/instrument-sans';
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
  { src: '/moment-mural-01.webp', height: 1614 },
  { src: '/moment-mural-02.webp', height: 1614 },
  { src: '/moment-mural-03.webp', height: 1614 },
  { src: '/moment-mural-04.webp', height: 1614 },
  { src: '/moment-mural-05.webp', height: 1522 },
  { src: '/moment-mural-06.webp', height: 1522 },
  { src: '/moment-mural-07.webp', height: 1522 },
  { src: '/moment-mural-08.webp', height: 1522 },
  { src: '/moment-mural-09.webp', height: 1614 },
  { src: '/moment-mural-10.webp', height: 1614 },
  { src: '/moment-mural-11.webp', height: 1614 },
  { src: '/moment-mural-12.webp', height: 1614 },
] as const;

function ProductPreview() {
  const [signal, setSignal] = useState<Signal>('Earnings');
  const [decision, setDecision] = useState<Decision | null>(null);
  const current = signals[signal];

  return <div className="moment-preview" id="experience" tabIndex={-1} aria-label="Interactive MOMENT product preview">
    <div className="moment-preview-bar"><span className="moment-preview-brand"><SeedLogo/>MOMENT <i/> Explore</span><span className="moment-preview-mode">Practice portfolio</span></div>
    <div className="moment-preview-body">
      <div className="moment-preview-intro"><h2>Look Beyond the Price.</h2><p>Choose a signal to see more of the company.</p><div className="moment-signal-list" role="group" aria-label="Explore company evidence">{(Object.keys(signals) as Signal[]).map((item) => <button key={item} type="button" aria-pressed={signal === item} className={signal === item ? 'is-selected' : ''} onClick={() => setSignal(item)}>{item}</button>)}</div></div>
      <div className="moment-preview-detail"><span className="moment-preview-note">Illustrative company view</span><div className="moment-preview-evidence" key={signal}><h3>{current.title}</h3><p>{current.detail}</p><div className="moment-preview-chart" role="img" aria-label="Illustrative trend, not market data"><svg viewBox="0 0 290 100" preserveAspectRatio="none" aria-hidden="true"><path d={current.path} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg></div></div><div className="moment-preview-choice"><span>What would you do?</span><div role="group" aria-label="Choose a virtual practice decision">{(['Buy', 'Hold', 'Sell'] as Decision[]).map((item) => <button key={item} type="button" aria-pressed={decision === item} className={decision === item ? 'is-selected' : ''} onClick={() => setDecision(item)}>{item}</button>)}</div><p aria-live="polite" key={decision ?? 'none'}>{decision ? `${decision} selected for this practice view.` : 'Virtual decisions only.'}</p></div></div>
    </div>
  </div>;
}

// The film belongs to the finished learning experience. Keep its frame ready
// without presenting a fabricated product walkthrough as working footage.
const learningVideoSrc: string | null = null;

function LearningFilm() {
  return <section className="moment-film moment-reveal" aria-labelledby="film-heading">
    <div className="moment-film-heading"><h2 id="film-heading">See the Bigger Picture.</h2><p>A closer look at learning in MOMENT will live here once the classroom experience is complete.</p></div>
    <div className="moment-film-frame moment-drift" aria-label="Reserved space for the MOMENT learning film">
      {learningVideoSrc ? <video src={learningVideoSrc} autoPlay muted loop playsInline controls aria-label="MOMENT learning walkthrough"/> : <div className="moment-film-poster"><span className="moment-film-aperture" aria-hidden="true"><SeedLogo/></span><span>Learning film coming later</span></div>}
    </div>
  </section>;
}

function ClassroomPreview() {
  return <div className="moment-classroom-window" aria-label="Illustration of the teacher setup preview">
    <div className="moment-classroom-windowbar"><span><SeedLogo/> MOMENT</span><span>Teacher preview</span></div>
    <div className="moment-classroom-windowbody"><div><span className="moment-classroom-step">Your class</span><h3>Create Your Class.</h3><p>Choose a starting budget and investment access. You can change these later.</p></div><div className="moment-classroom-fields"><div><span>Class name</span><strong>Economics · Period 3</strong></div><div><span>Starting virtual cash per student</span><strong>$10,000</strong></div><div><span>What can students invest in?</span><strong>All supported stocks</strong></div></div></div>
    <div className="moment-classroom-windowfoot">Illustrative setup · Saved in this browser · No real accounts or trades</div>
  </div>;
}

function InquiryScene() {
  const questions = ['What does this company make?', 'How does it earn?', 'What else could change its story?'];
  return <section className="moment-inquiry moment-reveal" aria-labelledby="inquiry-heading">
    <figure className="moment-inquiry-art"><img src="/moment-research-folio.webp" width="1448" height="1086" loading="lazy" decoding="async" alt="Illustrative glass research folio containing a chart, product sketches, and an industry map"/><figcaption>Research concept visual</figcaption></figure>
    <div className="moment-inquiry-glass moment-drift">
      <div className="moment-inquiry-intro"><h2 id="inquiry-heading">Ask What the Price Can’t Answer.</h2><p>One number can start an investigation. The next question is where understanding begins.</p></div>
      <ol>{questions.map((question, index) => <li key={question}><span aria-hidden="true">0{index + 1}</span><strong>{question}</strong></li>)}</ol>
    </div>
  </section>;
}

function PracticeScene() {
  return <section className="moment-practice moment-reveal" aria-labelledby="practice-heading"><div className="moment-practice-glass moment-drift"><h2 id="practice-heading">Room to Think Before You Choose.</h2><p>A virtual decision gives students a way to test what they think, with the evidence still in view.</p></div><figure className="moment-practice-art"><img src="/moment-practice-screen.webp" width="1448" height="1086" loading="lazy" decoding="async" alt="Illustrative glass screen with an evidence chart and three virtual decision choices"/><figcaption>Virtual decision concept visual</figcaption></figure></section>;
}

export default function Landing({ returning }: { returning: boolean }) {
  const landingRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = landingRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const elements = root.querySelectorAll<HTMLElement>('.moment-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .14, rootMargin: '0px 0px -4% 0px' });
    elements.forEach((element) => observer.observe(element));
    root.classList.add('motion-ready');
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = landingRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const planes = Array.from(root.querySelectorAll<HTMLElement>('.moment-drift'));
    let frame = 0;
    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const limit = window.innerWidth <= 600 ? 16 : 38;
      const positions = planes.map((plane) => {
        const rect = plane.getBoundingClientRect();
        return Math.max(-limit, Math.min(limit, (viewport / 2 - rect.top - rect.height / 2) * .09));
      });
      planes.forEach((plane, index) => plane.style.setProperty('--glass-drift', `${positions[index]}px`));
    };
    const queue = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    return () => {
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <main className="moment-landing" ref={landingRef}>
    <div className="moment-mural" aria-hidden="true">
      {muralTiles.map((tile, index) => <img key={tile.src} src={tile.src} alt="" width="3840" height={tile.height} loading={index < 2 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async"/>)}
    </div>
    <div className="moment-foreground">
      <section className="moment-hero" aria-labelledby="hero-heading"><div><h1 id="hero-heading"><span>See Past</span><span>The Price.</span></h1><p>Discover the story behind a company before you decide what to do next.</p><div className="moment-hero-actions"><a className="moment-primary" href={returning ? '#/teacher' : '#/teacher/setup'}>{returning ? 'Open your workspace' : 'Create a class'}<Arrow/></a><button className="moment-explore" type="button" onClick={scrollToExperience}>Explore the preview<Arrow down/></button></div></div></section>
      <section className="moment-showcase" aria-label="MOMENT product preview"><ProductPreview/></section>
      <LearningFilm/>
      <section className="moment-thesis moment-reveal" aria-labelledby="thesis-heading"><h2 id="thesis-heading">A Price Is Only the Beginning.</h2><p>What a company makes, how it earns, and where it fits in the world are all part of the story. MOMENT gives students a place to look closer before they make a virtual decision.</p></section>
      <InquiryScene/>
      <section className="moment-classroom moment-reveal" aria-labelledby="classroom-heading"><div className="moment-classroom-copy"><h2 id="classroom-heading">Make Room for Curiosity.</h2><p>Create a class, choose a virtual starting budget, and set the boundaries for what students can explore.</p><a className="moment-primary" href={returning ? '#/teacher' : '#/teacher/setup'}>{returning ? 'Open your workspace' : 'Explore teacher setup'}<Arrow/></a></div><ClassroomPreview/></section>
      <PracticeScene/>
      <section className="moment-closing moment-reveal" aria-labelledby="closing-heading"><div className="moment-closing-glass moment-drift"><h2 id="closing-heading">Look Closer.</h2><p>Every company has more to discover than a changing number. Give your class a place to ask better questions and practice deciding for themselves.</p><a className="moment-primary" href={returning ? '#/teacher' : '#/teacher/setup'}>{returning ? 'Open your workspace' : 'Create a class'}<Arrow/></a></div></section>
    </div>
  </main>;
}
