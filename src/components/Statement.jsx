import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { stats } from "../data/profile.jsx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const lines = ["Doesn't just", "write code."];

/**
 * Self-contained pin frame — all content in normal flow (no absolute escape).
 * overflow clipped so type never paints onto neighboring sections.
 */
export default function Statement() {
  const pinRef = useRef(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.set(".st-line", { yPercent: 110 });
      gsap.set(".st-copy, .st-stat", { autoAlpha: 0, y: 16 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "statement",
          trigger: pinRef.current,
          start: "top top",
          end: "+=160%",
          pin: true,
          pinSpacing: true,
          pinType: "fixed",
          scrub: reduce ? 0.1 : 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: -20,
        },
      });

      tl.to(".st-line", { yPercent: 0, stagger: 0.1, duration: 0.28 }, 0.05)
        .to(".st-copy", { autoAlpha: 1, y: 0, duration: 0.16 }, 0.38)
        .to(".st-stat", { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.14 }, 0.55);
    },
    { scope: pinRef }
  );

  return (
    <section ref={pinRef} className="statement-pin pin-frame relative z-0 bg-[var(--bg)]">
      <div className="statement-sticky pin-viewport flex flex-col justify-center overflow-hidden">
        <div className="wrap flex w-full flex-col gap-8 py-10 sm:gap-10 sm:py-14 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12">
          <h2 className="display-huge" aria-label="Doesn't just write code.">
            {lines.map((line) => (
              <span key={line} className="line-mask">
                <span className="st-line inline-block will-change-transform">{line}</span>
              </span>
            ))}
          </h2>

          <div className="st-copy">
            <p className="text-base leading-[1.75] text-soft sm:text-lg">
              Cafes taking orders on paper. Auto shops tracking queues on a
              whiteboard. Studios costing projects by hand. Malcolm analyzes the
              workflow, designs a custom system, ships the full stack, hardens it,
              and stays to maintain it.
            </p>
          </div>
        </div>

        <div className="st-stats wrap mt-auto w-full pb-8 pt-4 sm:pb-10">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="st-stat rounded-xl border border-deep/60 bg-night/80 px-3 py-3 backdrop-blur-sm sm:px-4"
              >
                <p className="font-display text-xl font-bold sm:text-2xl" style={{ color: "var(--spark)" }}>
                  {s.value}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-soft sm:text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
