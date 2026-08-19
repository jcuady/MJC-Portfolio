import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { profile } from "../data/profile.jsx";

/**
 * Graduation default → Barong on hover (fine pointer) or tap (touch).
 * Label always matches the visible shot. Transform/opacity only.
 */
export default function HeroPortrait() {
  const frameRef = useRef(null);
  const [showBarong, setShowBarong] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const hoverMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const narrowMq = window.matchMedia("(max-width: 767px)");
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setFinePointer(hoverMq.matches && !narrowMq.matches);
      setReduce(reduceMq.matches);
    };
    sync();
    hoverMq.addEventListener("change", sync);
    narrowMq.addEventListener("change", sync);
    reduceMq.addEventListener("change", sync);
    return () => {
      hoverMq.removeEventListener("change", sync);
      narrowMq.removeEventListener("change", sync);
      reduceMq.removeEventListener("change", sync);
    };
  }, []);

  const lift = (on) => {
    const el = frameRef.current;
    if (!el || reduce) return;
    gsap.to(el, {
      y: on ? -3 : 0,
      scale: on ? 1.015 : 1,
      duration: on ? 0.28 : 0.22,
      ease: on ? "power2.out" : "power2.inOut",
      overwrite: "auto",
    });
  };

  const setAlt = (on) => {
    setShowBarong(on);
    lift(on);
  };

  return (
    <figure className="hero-portrait-wrap">
      <button
        type="button"
        className="hero-portrait group relative block w-full cursor-pointer overflow-hidden bg-night text-left outline-none transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:ring-2 focus-visible:ring-[var(--pale)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] active:scale-[0.99]"
        aria-label={`${profile.name} — ${
          finePointer ? "hover to see Barong portrait" : "tap to switch portraits"
        }`}
        aria-pressed={showBarong}
        onMouseEnter={() => {
          if (finePointer) setAlt(true);
        }}
        onMouseLeave={() => {
          if (finePointer) setAlt(false);
        }}
        onClick={() => {
          // Touch / coarse pointer: tap toggles. Fine pointer uses hover only.
          if (!finePointer) setAlt(!showBarong);
        }}
      >
        <div
          ref={frameRef}
          className="hero-portrait-frame relative aspect-[4/5] w-full will-change-transform"
        >
          <picture>
            <source srcSet="/portraits/graduation.webp?v=3" type="image/webp" />
            <img
              data-shot="grad"
              src="/portraits/graduation.jpg?v=3"
              alt={`${profile.name} in DLSU graduation attire`}
              width={400}
              height={500}
              decoding="async"
              loading="eager"
              className={`absolute inset-0 h-full w-full object-cover object-[center_22%] transition-opacity duration-300 ease-out ${
                showBarong ? "opacity-0" : "opacity-100"
              }`}
              style={{ transitionDuration: reduce ? "0ms" : undefined }}
              ref={(el) => {
                if (el) el.setAttribute("fetchpriority", "high");
              }}
            />
          </picture>
          <picture>
            <source srcSet="/portraits/barong.webp?v=3" type="image/webp" />
            <img
              data-shot="barong"
              src="/portraits/barong.jpg?v=3"
              alt={`${profile.name} in Barong Tagalog`}
              width={400}
              height={500}
              decoding="async"
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover object-[center_20%] transition-opacity duration-300 ease-out ${
                showBarong ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDuration: reduce ? "0ms" : undefined }}
            />
          </picture>
          <span
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-[rgba(13,28,21,0.28)] to-transparent"
            aria-hidden="true"
          />
        </div>
      </button>
      <figcaption className="hero-portrait-hint">
        {showBarong
          ? finePointer
            ? "Barong · move away to return"
            : "Barong · tap to return"
          : finePointer
            ? "Grad · hover for Barong"
            : "Grad · tap for Barong"}
      </figcaption>
    </figure>
  );
}
