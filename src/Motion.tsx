import { useEffect, useRef, useState } from "react";

/** Decorative light, never data. The observer stops work outside the viewport. */
export function Atmosphere({ quiet = false }: { quiet?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`atmosphere ${quiet ? "atmosphere-quiet" : ""}`}
      data-visible={visible}
      aria-hidden="true"
    >
      <div className="light-field light-field-one" />
      <div className="light-field light-field-two" />
      <div className="light-field light-field-three" />
      <svg
        className="light-contours"
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g>
          {Array.from({ length: 9 }, (_, index) => (
            <path
              key={index}
              d={`M -180 ${720 + index * 32} C 160 ${170 + index * 42}, 410 ${1110 + index * 16}, 770 ${520 + index * 24} S 1140 ${60 + index * 36}, 1580 ${150 + index * 38}`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export function usePageMotion(route: string) {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [hidden, setHidden] = useState(document.hidden);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    const visibility = () => setHidden(document.hidden);
    media.addEventListener("change", change);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", change);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    if (paused || reduced || !("IntersectionObserver" in window)) return;
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) {
            (target as HTMLElement).dataset.entered = "true";
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.12 },
    );
    elements.forEach((element) => {
      // Visible defaults survive an unavailable observer or disabled JavaScript.
      element.dataset.entered =
        element.getBoundingClientRect().top < window.innerHeight
          ? "true"
          : "false";
      observer.observe(element);
    });
    return () => {
      observer.disconnect();
      elements.forEach((element) => delete element.dataset.entered);
    };
  }, [route, paused, reduced]);
  return {
    paused,
    reduced,
    hidden,
    toggle: () => setPaused((value) => !value),
  };
}

export function MotionControl({
  paused,
  reduced,
  toggle,
}: {
  paused: boolean;
  reduced: boolean;
  toggle: () => void;
}) {
  return (
    <button
      className="motion-control"
      type="button"
      onClick={toggle}
      disabled={reduced}
      aria-label={
        reduced
          ? "Animations off: reduced motion preference"
          : paused
            ? "Resume animations"
            : "Pause animations"
      }
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        aria-hidden="true"
        fill="currentColor"
      >
        {paused || reduced ? (
          <path d="m5 3 8 5-8 5Z" />
        ) : (
          <path d="M4 3h3v10H4zm5 0h3v10H9z" />
        )}
      </svg>
      <span>{paused || reduced ? "Motion off" : "Pause motion"}</span>
    </button>
  );
}
