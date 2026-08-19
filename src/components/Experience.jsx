import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { experience } from "../data/profile.jsx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Career — latest-first (resume order).
 * CSS sticky track + scrub onUpdate — avoids GSAP multi-pin start desync.
 */
export default function Experience() {
  const rootRef = useRef(null);
  const career = experience;
  const n = career.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const track = rootRef.current.querySelector(".xp-track");
        const sticky = rootRef.current.querySelector(".xp-sticky");
        const items = gsap.utils.toArray(".xp-card");
        const dots = gsap.utils.toArray(".xp-dot");
        const nums = gsap.utils.toArray(".xp-num");
        const counter = rootRef.current.querySelector(".xp-counter");
        const fill = rootRef.current.querySelector(".xp-spine-fill");
        let st;
        let tl;
        let lastKey = "";

        /** Measure career track in document space. No hero pin required. */
        const measure = () => {
          if (!track) return null;
          const absTop = Math.round(track.getBoundingClientRect().top + window.scrollY);
          if (absTop < window.innerHeight * 0.85) return null;
          if (track.offsetHeight < window.innerHeight * 1.4) return null;
          const absEnd = absTop + track.offsetHeight - window.innerHeight;
          return { absTop, absEnd: Math.max(absTop + 100, absEnd) };
        };

        const mount = () => {
          const geo = measure();
          if (!geo) return false;
          const key = `${geo.absTop}:${geo.absEnd}`;
          if (key === lastKey && st) return true;
          lastKey = key;

          st?.kill();
          tl?.kill();

          gsap.set(items, { autoAlpha: 0, y: 16 });
          gsap.set(items[0], { autoAlpha: 1, y: 0 });
          gsap.set(dots, { scale: 0.65, backgroundColor: "transparent" });
          gsap.set(dots[0], { scale: 1.2, backgroundColor: "var(--spark)" });
          gsap.set(nums, { autoAlpha: 0.35 });
          gsap.set(nums[0], { autoAlpha: 1 });
          if (fill) gsap.set(fill, { scaleY: 0 });
          if (counter) {
            counter.textContent = `01 / ${String(n).padStart(2, "0")}`;
          }

          const fade = reduce ? 0.035 : 0.065;
          const slot = 1 / n;
          const { absTop, absEnd } = geo;

          tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              id: "career",
              trigger: track,
              start: absTop,
              end: absEnd,
              scrub: reduce ? 0.18 : 0.7,
              // NEVER refresh-remeasure — GSAP briefly unpins and poisons Y
              invalidateOnRefresh: false,
              refreshPriority: -80,
              onUpdate: (self) => {
                const idx = Math.min(n - 1, Math.floor(self.progress * n + 0.0001));
                if (counter) {
                  counter.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
                }
                if (sticky) {
                  sticky.dataset.progress = self.progress.toFixed(3);
                  sticky.dataset.idx = String(idx);
                }
              },
            },
          });
          st = tl.scrollTrigger;

          if (fill) tl.to(fill, { scaleY: 1, duration: 1 }, 0);

          items.forEach((item, i) => {
            if (i === 0) return;
            const t = i * slot;
            tl.to(items[i - 1], { autoAlpha: 0, y: -12, duration: fade }, t - fade);
            tl.to(dots[i - 1], { scale: 0.65, backgroundColor: "transparent", duration: fade }, t - fade);
            tl.to(nums[i - 1], { autoAlpha: 0.35, duration: fade }, t - fade);
            tl.fromTo(
              item,
              { autoAlpha: 0, y: 18 },
              { autoAlpha: 1, y: 0, duration: fade },
              t
            );
            tl.to(dots[i], { scale: 1.2, backgroundColor: "var(--spark)", duration: fade }, t);
            tl.to(nums[i], { autoAlpha: 1, duration: fade }, t);
            if (!reduce) {
              tl.fromTo(
                item.querySelectorAll(".xp-line"),
                { yPercent: 50 },
                { yPercent: 0, duration: fade * 0.9 },
                t + fade * 0.05
              );
            }
          });

          if (sticky) {
            sticky.dataset.start = String(absTop);
            sticky.dataset.end = String(absEnd);
          }
          return true;
        };

        // Retry until pin spacers are real (HMR / StrictMode / late pin)
        const tryMount = () => mount();
        const timers = [200, 500, 1000, 1600, 2400].map((ms) => setTimeout(tryMount, ms));
        const iv = setInterval(tryMount, 400);
        const stopIv = setTimeout(() => clearInterval(iv), 6000);
        const onLoad = () => setTimeout(tryMount, 80);
        window.addEventListener("load", onLoad);
        // Resize (orientation) — remount when pin geometry changes; measure() rejects unpin frames
        const onResize = () => {
          lastKey = "";
          tryMount();
        };
        window.addEventListener("resize", onResize);

        return () => {
          timers.forEach(clearTimeout);
          clearInterval(iv);
          clearTimeout(stopIv);
          window.removeEventListener("load", onLoad);
          window.removeEventListener("resize", onResize);
          tl?.kill();
          st?.kill();
        };
      });

      mm.add("(max-width: 767px)", () => {
        gsap.set(".xp-card", { autoAlpha: 1 });
        gsap.set(".xp-spine-fill", { scaleY: 1 });
        gsap.set(".xp-dot", { scale: 1, backgroundColor: "var(--spark)" });
        gsap.set(".xp-num", { autoAlpha: 1 });
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          ScrollTrigger.batch(".xp-m-card", {
            start: "top 90%",
            once: true,
            onEnter: (els) =>
              gsap.fromTo(
                els,
                { autoAlpha: 0, y: 16 },
                { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.45, ease: "power2.out" }
              ),
          });
        }
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [n] }
  );

  return (
    <section id="experience" ref={rootRef} className="xp-pin relative z-0 bg-[var(--bg)]">
      {/* Tall track = scroll runway; sticky panel fills the frame */}
      <div
        className="xp-track relative hidden md:block"
        style={{ height: `${Math.max(n, 3) * 72}vh` }}
      >
        <div className="xp-sticky sticky top-0 flex h-[100svh] flex-col overflow-hidden bg-[var(--bg)]">
          <div className="wrap flex min-h-0 flex-1 flex-col py-8 sm:py-10">
            <div className="flex shrink-0 flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="eyebrow">Career progression</p>
                <h2 className="section-title mt-2">Experience</h2>
                <p className="section-lead">
                  Latest first — matching the resume. Each role is its own step, including Kadokohi,
                  Offgrid, and MGC Architecture.
                </p>
              </div>
              <p
                className="xp-counter font-mono text-sm tracking-widest text-forest"
                aria-live="polite"
              >
                01 / {String(n).padStart(2, "0")}
              </p>
            </div>

            <div className="mt-6 grid min-h-0 flex-1 gap-6 md:grid-cols-[minmax(128px,168px)_minmax(0,1fr)] md:gap-10 lg:gap-14">
              <div className="relative self-stretch" aria-hidden="true">
                <div className="absolute bottom-1 left-[9px] top-1 w-px bg-deep" />
                <div
                  className="xp-spine-fill absolute bottom-1 left-[9px] top-1 w-px origin-top bg-spring"
                  style={{ transform: "scaleY(0)" }}
                />
                <ol className="relative flex h-full min-h-0 flex-col justify-between py-0.5">
                  {career.map((job, i) => (
                    <li key={job.period + job.org} className="flex items-start gap-2.5">
                      <span className="xp-dot mt-1 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-spring bg-transparent" />
                      <div className="min-w-0">
                        <p className="xp-num font-mono text-xs uppercase tracking-[0.14em] text-soft">
                          {String(i + 1).padStart(2, "0")}
                        </p>
                        <p className="mt-0.5 font-mono text-xs leading-tight text-forest lg:text-xs">
                          {job.period}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="xp-stage relative min-h-0">
                {career.map((job, i) => (
                  <article
                    key={job.role + job.org}
                    className="xp-card absolute inset-0 flex flex-col justify-center overflow-hidden pr-2"
                  >
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-forest">
                      Step {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-mist lg:text-3xl">
                      <span className="line-mask block">
                        <span className="xp-line inline-block">{job.role}</span>
                      </span>
                    </h3>
                    {job.url ? (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block cursor-pointer text-base font-medium transition-colors hover:underline"
                        style={{ color: "var(--spark)" }}
                      >
                        {job.org}
                      </a>
                    ) : (
                      <p className="mt-2 text-base font-medium" style={{ color: "var(--spark)" }}>
                        {job.org}
                      </p>
                    )}
                    <p className="mt-1 font-mono text-xs text-forest">{job.period}</p>
                    <ul className="mt-5 max-w-2xl space-y-2">
                      {job.points.map((pt) => (
                        <li
                          key={pt}
                          className="flex gap-3 text-sm leading-relaxed text-soft lg:text-[15px]"
                        >
                          <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-spring" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            <p className="mt-4 shrink-0 text-center mono-tag text-forest">Scroll to advance career</p>
          </div>
        </div>
      </div>

      {/* Mobile: stacked list, no sticky pin */}
      <div className="wrap py-10 md:hidden">
        <p className="eyebrow">Career progression</p>
        <h2 className="section-title mt-2">Experience</h2>
        <p className="section-lead">
          Latest first — matching the resume. Kadokohi, Offgrid, and MGC Architecture each own a
          step.
        </p>
        <div className="xp-mobile mt-8 space-y-8">
          {career.map((job, i) => (
            <article key={job.role + job.org} className="xp-m-card border-l-2 border-deep pl-4">
              <p className="font-mono text-xs tracking-wide text-forest">
                {String(i + 1).padStart(2, "0")} · {job.period}
              </p>
              <h3 className="mt-1.5 font-display text-xl font-semibold text-mist">{job.role}</h3>
              {job.url ? (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer text-sm font-medium transition-colors hover:underline"
                  style={{ color: "var(--spark)" }}
                >
                  {job.org}
                </a>
              ) : (
                <p className="text-sm font-medium" style={{ color: "var(--spark)" }}>
                  {job.org}
                </p>
              )}
              <ul className="mt-3 space-y-1.5">
                {job.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5 text-sm leading-relaxed text-soft">
                    <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-spring" />
                    {pt}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
