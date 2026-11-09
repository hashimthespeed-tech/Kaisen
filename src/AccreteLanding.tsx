import { useEffect, useState } from 'react';
import SeedLogo from './SeedLogo';
import './accrete.css';

export function Arrow({ down = false, back = false }: { down?: boolean; back?: boolean }) {
  return <svg className="arrow-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d={back ? 'M20 12H4m6-6-6 6 6 6' : down ? 'M12 4v16m-6-6 6 6 6-6' : 'M5 12h14m-6-6 6 6-6 6'}/></svg>;
}

export function scrollToExperience() {
  const target = document.getElementById('experience');
  target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  target?.focus({ preventScroll: true });
}

const evidence = {
  earnings: { number: '01', title: 'Earnings', kicker: 'The numbers', headline: 'Revenue is growing. Margins tell a different story.', detail: 'A stronger quarter can still leave questions about what the business keeps.', path: 'M0 94 C32 84 48 90 76 72 S118 82 150 63 S191 75 220 49 S258 58 290 32 S334 46 370 18' },
  products: { number: '02', title: 'Products', kicker: 'The business', headline: 'A new product opens a larger market.', detail: 'Look at what the company makes, who needs it, and how that might change.', path: 'M0 92 C38 86 54 78 88 79 S138 64 169 65 S219 55 246 45 S313 50 338 30 L370 17' },
  industry: { number: '03', title: 'Industry', kicker: 'The context', headline: 'The wider market is moving, too.', detail: 'A company makes more sense when you understand the forces around it.', path: 'M0 91 C27 75 52 89 77 69 S120 72 147 54 S193 58 217 43 S269 60 293 34 S340 43 370 22' },
} as const;
type Evidence = keyof typeof evidence;
const responses = { Buy: 'You chose to invest more. Which signal gives you the most confidence?', Hold: 'You chose to wait. What new evidence could change your view?', Sell: 'You chose to reduce your position. Which risk matters most?' } as const;
type Decision = keyof typeof responses;

function EvidenceIcon({ kind }: { kind: Evidence }) {
  const paths = { earnings: 'M4 19v-5m5 5V9m5 10V5m5 14v-8', products: 'm12 2 9 5-9 5-9-5 9-5Zm-9 5v10l9 5 9-5V7M12 12v10', industry: 'm12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5' };
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[kind]}/></svg>;
}

function ProductPreview() {
  const [active, setActive] = useState<Evidence>('earnings');
  const [decision, setDecision] = useState<Decision | null>(null);
  const item = evidence[active];
  return <div className="al-product" aria-label="Interactive illustration of the Accrete learning experience">
    <div className="al-product-top"><div className="al-product-brand"><SeedLogo/><span>Accrete <b>/</b> Explore</span></div><span className="al-product-class">Practice portfolio <i/></span></div>
    <div className="al-product-body"><aside className="al-product-rail" aria-label="Explore company evidence"><span className="al-rail-eyebrow">COMPANY STORY</span><h2>There is more<br/>to the story.</h2><p>Choose a signal to examine.</p><div className="al-evidence-list">{(Object.keys(evidence) as Evidence[]).map(key => <button type="button" key={key} className={active === key ? 'active' : ''} aria-pressed={active === key} onClick={() => setActive(key)}><EvidenceIcon kind={key}/><span>{evidence[key].title}</span><span className="al-list-arrow">↗</span></button>)}</div><span className="al-rail-foot">A clearer view starts here. <Arrow/></span></aside>
      <div className="al-product-content"><div className="al-content-header"><span><i/> LIVE PRACTICE SITUATION</span><span>01 / 03</span></div><div className="al-insight" key={active}><span className="al-insight-index">{item.number} / {item.kicker}</span><h3>{item.headline}</h3><p>{item.detail}</p><div className="al-chart" aria-label="Illustrative trend, not market data" role="img"><div className="al-chart-grid"/><svg viewBox="0 0 370 110" preserveAspectRatio="none" aria-hidden="true"><path d={item.path} pathLength="1" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><circle cx="370" cy="18" r="6" fill="#00c889"/></svg></div><div className="al-chart-caption"><span>Company signal</span><span>Illustrative only</span></div></div><div className="al-decision"><div><span className="al-decision-label">YOUR MOVE</span><h4>What would you do next?</h4><p aria-live="polite">{decision ? responses[decision] : 'Make a choice. Then explain the evidence behind it.'}</p></div><div className="al-decision-actions" role="group" aria-label="Choose a practice decision">{(Object.keys(responses) as Decision[]).map(key => <button key={key} type="button" className={decision === key ? 'selected' : ''} aria-pressed={decision === key} onClick={() => setDecision(key)}>{key}</button>)}</div></div></div>
    </div></div>;
}

function ScrollChapter() {
  const chapters = [
    { title: 'Earnings', kind: 'earnings' as const, detail: 'What changed in the numbers?' },
    { title: 'Products', kind: 'products' as const, detail: 'What is the company building?' },
    { title: 'Industry', kind: 'industry' as const, detail: 'What is happening around it?' },
  ];
  return <section className="al-scroll-chapter" aria-labelledby="experience">
    <div className="al-scroll-track"><div className="al-scroll-pin">
      <div className="al-scroll-copy"><span className="al-section-index">02 / THE BIGGER PICTURE</span><h2 id="experience" tabIndex={-1}>A decision<br/>takes shape.</h2><p>One signal starts a question. The full picture gives you a reason to act.</p><div className="al-scene-phases" aria-hidden="true"><span className="al-scene-phase">01&nbsp; Explore the signals</span><span className="al-scene-phase">02&nbsp; Connect the evidence</span><span className="al-scene-phase">03&nbsp; Choose with context</span></div></div>
      <div className="al-scene-stage" aria-hidden="true"><div className="al-scene-glow"/><div className="al-scene-seed"><SeedLogo/></div><div className="al-scene-thread"/>
        {chapters.map(({ title, kind, detail }, index) => <div className={`al-scene-card al-scene-card-${index + 1}`} key={kind}><span className="al-scene-card-index">0{index + 1} / EVIDENCE</span><div><EvidenceIcon kind={kind}/><strong>{title}</strong></div><p>{detail}</p><i/><i/></div>)}
        <div className="al-scene-outcome"><span className="al-scene-outcome-label"><i/> PRACTICE SCENARIO</span><h3>Now, what would<br/>you do next?</h3><p>The evidence is in view. Make a decision you can explain.</p><div className="al-scene-outcome-tags"><span>Earnings</span><span>Products</span><span>Industry</span></div><div className="al-scene-outcome-choice"><span>Buy</span><span>Hold</span><span>Sell</span></div></div>
      </div>
      <div className="al-scene-progress" aria-hidden="true"><span/><span>SCROLL TO BUILD THE PICTURE</span></div>
    </div></div>
  </section>;
}

export default function AccreteLanding({ returning }: { returning: boolean }) {
  useEffect(() => {
    const world = document.querySelector<HTMLElement>('.al-world');
    const landing = document.querySelector<HTMLElement>('.accrete-landing');
    if (!world || !landing || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const reveals = landing.querySelectorAll<HTMLElement>('.al-showcase-heading > *, .al-product, .al-showcase-foot, .al-scroll-copy > *, .al-story-intro > *, .al-steps article, .al-teacher > .al-section-index, .al-teacher h2, .al-teacher > div > div');
    reveals.forEach(element => element.classList.add('al-reveal'));
    landing.classList.add('al-motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach(element => observer.observe(element));
    const track = landing.querySelector<HTMLElement>('.al-scroll-track');
    const scene = landing.querySelector<HTMLElement>('.al-scroll-pin');
    const cards = [...landing.querySelectorAll<HTMLElement>('.al-scene-card')];
    const phases = [...landing.querySelectorAll<HTMLElement>('.al-scene-phase')];
    const outcome = landing.querySelector<HTMLElement>('.al-scene-outcome');
    const seed = landing.querySelector<HTMLElement>('.al-scene-seed');
    let frame = 0;
    let distance = 0;
    let target = 0;
    let sceneProgress = 0;
    let sceneTarget = 0;
    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const paint = () => {
      distance += (target - distance) * .16;
      if (Math.abs(target - distance) < .4) distance = target;
      sceneProgress += (sceneTarget - sceneProgress) * .14;
      if (Math.abs(sceneTarget - sceneProgress) < .001) sceneProgress = sceneTarget;
      const mobile = window.innerWidth < 601;
      world.style.setProperty('--layer-backdrop-y', `${Math.round(distance * (mobile ? .10 : .18))}px`);
      world.style.setProperty('--layer-product-y', `${Math.round(distance * (mobile ? -.06 : -.07))}px`);
      world.style.setProperty('--layer-foreground-y', `${Math.round(Math.min(distance, mobile ? 480 : 450) * (mobile ? -.11 : -.18))}px`);
      if (scene && outcome && seed) {
        const gather = clamp(sceneProgress / .42);
        const cardFade = clamp((sceneProgress - .34) / .12);
        const resolve = clamp((sceneProgress - .56) / .18);
        const merge = clamp((sceneProgress - .30) / .20) * (1 - resolve);
        const xScale = mobile ? (window.innerWidth < 350 ? .16 : .30) : window.innerWidth < 1100 ? .75 : 1;
        const yScale = mobile ? .8 : xScale;
        const starts = [[-245, -137, -11], [225, -38, 9], [-175, 145, -7]];
        const ends = [[-26, -17, -5], [0, 0, 0], [26, 17, 5]];
        cards.forEach((card, index) => {
          const start = starts[index]; const end = ends[index];
          const x = (start[0] * (1 - gather) + end[0] * gather) * xScale;
          const y = (start[1] * (1 - gather) + end[1] * gather) * yScale;
          const rotation = (start[2] * (1 - gather) + end[2] * gather) * (mobile ? .65 : 1);
          card.style.transform = `translate3d(${x}px,${y}px,0) rotate(${rotation}deg) scale(${1 - gather * .08})`;
          card.style.opacity = String(1 - cardFade);
        });
        phases.forEach((phase, index) => {
          const opacity = index === 0 ? clamp(1 - sceneProgress / .31) : index === 1 ? clamp((sceneProgress - .16) / .18) * clamp((.69 - sceneProgress) / .17) : clamp((sceneProgress - .54) / .18);
          phase.style.opacity = String(opacity);
          phase.style.transform = `translateY(${Math.round((1 - opacity) * 15)}px)`;
        });
        outcome.style.opacity = String(resolve);
        outcome.style.transform = `translate3d(0,${Math.round((1 - resolve) * 90)}px,0) scale(${.83 + resolve * .17})`;
        seed.style.opacity = String((1 - resolve) * .18 + merge * .54);
        seed.style.transform = `scale(${.75 + gather * .45 + merge * .25})`;
        scene.style.setProperty('--scene-progress', sceneProgress.toFixed(3));
      }
      frame = distance === target && sceneProgress === sceneTarget ? 0 : requestAnimationFrame(paint);
    };
    const onScroll = () => {
      target = Math.min(1300, Math.max(0, -world.getBoundingClientRect().top));
      if (track) {
        const rect = track.getBoundingClientRect();
        sceneTarget = clamp(-rect.top / Math.max(1, rect.height - window.innerHeight));
      }
      if (!frame) frame = requestAnimationFrame(paint);
    };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (frame) cancelAnimationFrame(frame); observer.disconnect(); };
  }, []);
  return <main className="accrete-landing"><div className="al-world"><div className="al-backdrop" aria-hidden="true"/>
    <section className="al-hero" aria-labelledby="hero-heading"><div className="al-hero-copy"><span className="al-eyebrow"><span/> INVESTING IS MORE THAN A NUMBER</span><h1 id="hero-heading"><span className="al-hero-line">See past</span><span className="al-hero-line"><em>the price.</em></span></h1><p>Discover the story behind a company. Make a decision with evidence, and see where it takes you.</p><div className="al-hero-actions"><a className="al-primary" href={returning ? '#/teacher' : '#/teacher/setup'}>{returning ? 'Open your workspace' : 'Create a class'}<Arrow/></a><button className="al-text-link" type="button" onClick={scrollToExperience}>Explore the experience <Arrow down/></button></div></div><span className="al-hero-corner">REAL COMPANIES <span>·</span> VIRTUAL MONEY <span>·</span> ROOM TO LEARN</span></section>
    <section className="al-showcase" aria-labelledby="showcase-heading"><div className="al-showcase-heading"><span>THE ACCRETE EXPERIENCE</span><h2 id="showcase-heading">From evidence<br/>to action.</h2><p>Explore the pieces that matter, then make a move you can explain.</p></div><div className="al-product-wrap"><ProductPreview/></div><img className="al-foreground" src="/accrete-foreground.webp" alt="" width="2172" height="724" loading="lazy"/><div className="al-showcase-foot"><span>01 / A CLOSER LOOK</span><span>SCROLL TO DISCOVER <Arrow down/></span></div></section>
    </div><ScrollChapter/><section className="al-story" aria-labelledby="learning-loop"><div className="al-story-intro"><span className="al-section-index">03 / THE LEARNING LOOP</span><h2 id="learning-loop">A better question<br/>changes everything.</h2><p>Accrete turns investing into a practice of looking closer. Students follow a path from curiosity to a decision and back to the evidence.</p></div><div className="al-steps"><article><span>01 — EXPLORE</span><h3>Find the signals.</h3><p>Look into the products, earnings, and industry behind a company.</p><div className="al-step-graphic al-step-graphic-one" aria-hidden="true"><i/><i/><i/></div></article><article><span>02 — DECIDE</span><h3>Make your move.</h3><p>Choose to buy, hold, or sell, and connect that choice to what you found.</p><div className="al-step-graphic al-step-graphic-two" aria-hidden="true"><i/><i/><i/></div></article><article><span>03 — REFLECT</span><h3>See what follows.</h3><p>Watch the outcome unfold, then revisit what you knew at the time.</p><div className="al-step-graphic al-step-graphic-three" aria-hidden="true"><svg viewBox="0 0 220 75"><path d="M0 64 C30 58 39 68 66 47 S107 58 136 33 S173 39 220 8" fill="none" stroke="currentColor" strokeWidth="3"/></svg></div></article></div></section>
    <section className="al-teacher"><span className="al-section-index">04 / FOR THE CLASSROOM</span><div><h2>Let curiosity<br/>lead the class.</h2><div><p>Set up a virtual portfolio and give students a place to practice decisions with real companies and no real money.</p><a className="al-primary" href="#/teacher/setup">Try teacher setup<Arrow/></a><small>Local design preview. No real account is created.</small></div></div></section>
  </main>;
}
