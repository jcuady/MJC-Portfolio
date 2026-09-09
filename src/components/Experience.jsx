import { useCallback, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronsDown } from "lucide-react";
import { experience } from "../data/profile.jsx";
import TimelineRail from "./experience/TimelineRail.jsx";
import RoleCard from "./experience/RoleCard.jsx";
import SnapshotCard from "./experience/SnapshotCard.jsx";
import BottomPanels from "./experience/BottomPanels.jsx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Career story — pinned desktop scroll, horizontal step rail on mobile.
 * Keeps verify seams: .xp-track .xp-sticky .xp-card .xp-counter .xp-m-card .xp-num .xp-dot .xp-spine-fill
 */
export default function Experience() {
  const rootRef = useRef(null);
  const career = experience;
  const n = career.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRef = useRef(0);
  const stRef = useRef(null);

  const setActive = useCallback((idx) => {
    const next = Math.max(0, Math.min(n - 1, idx));
    if (activeRef.current === next) return;
    activeRef.current = next;
    setActiveIndex(next);
  }, [n]);

  const scrollToStep = useCallback(
    (idx) => {
      const st = stRef.current || ScrollTrigger.getById("career");
      if (!st) {
        setActive(idx);
        return;
      }
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const progress = (idx + 0.42) / n;
      const y = st.start + (st.end - st.start) * progress;
      window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    },
    [n, setActive]
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px)", () => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const track = rootRef.current.querySelector(".xp-track");
        const sticky = rootRef.current.querySelector(".xp-sticky");
        const items = gsap.utils.toArray(".xp-card");
        const dots = gsap.utils.toArray(".xp-dot");
        const nums = gsap.utils.toArray(".xp-num");
        const counters = gsap.utils.toArray(".xp-counter");
        const fill = rootRef.current.querySelector(".xp-spine-fill");
        const railItems = gsap.utils.toArray(".xp-rail__item");
        let st;
        let tl;
        let lastKey = "";

        const measure = () => {
          if (!track) return null;
          const absTop = Math.round(track.getBoundingClientRect().top + window.scrollY);
          if (absTop < window.innerHeight * 0.85) return null;
          if (track.offsetHeight < window.innerHeight * 1.4) return null;
          const absEnd = absTop + track.offsetHeight - window.innerHeight;
          return { absTop, absEnd: Math.max(absTop + 100, absEnd) };
        };

        const paintCounters = (idx) => {
          const label = `${String(idx + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
          counters.forEach((c) => {
            c.textContent = label;
          });
        };

        const paintRail = (idx) => {
          railItems.forEach((el, i) => {
            el.classList.toggle("is-active", i === idx);
          });
        };

        const mount = () => {
          const geo = measure();
          if (!geo) return false;
          const key = `${geo.absTop}:${geo.absEnd}`;
          if (key === lastKey && st) {
            stRef.current = st;
            return true;
          }
          lastKey = key;

          st?.kill();
          tl?.kill();

          gsap.set(items, { autoAlpha: 0, y: 14 });
          gsap.set(items[0], { autoAlpha: 1, y: 0 });
          gsap.set(dots, { scale: 0.7, backgroundColor: "transparent" });
          gsap.set(dots[0], { scale: 1.15, backgroundColor: "var(--accent)" });
          gsap.set(nums, { autoAlpha: 0.38 });
          gsap.set(nums[0], { autoAlpha: 1 });
          if (fill) gsap.set(fill, { scaleY: 0 });
          paintCounters(0);
          paintRail(0);
          setActive(0);

          const fade = reduce ? 0.03 : 0.055;
          const slot = 1 / n;
          const { absTop, absEnd } = geo;

          tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              id: "career",
              trigger: track,
              start: absTop,
              end: absEnd,
              scrub: reduce ? 0.15 : 0.65,
              invalidateOnRefresh: false,
              refreshPriority: -80,
              onUpdate: (self) => {
                const idx = Math.min(n - 1, Math.floor(self.progress * n + 0.0001));
                paintCounters(idx);
                paintRail(idx);
                setActive(idx);
                if (sticky) {
                  sticky.dataset.progress = self.progress.toFixed(3);
                  sticky.dataset.idx = String(idx);
                }
              },
            },
          });
          st = tl.scrollTrigger;
          stRef.current = st;

          if (fill) tl.to(fill, { scaleY: 1, duration: 1 }, 0);

          items.forEach((item, i) => {
            if (i === 0) return;
            const t = i * slot;
            tl.to(items[i - 1], { autoAlpha: 0, y: -10, duration: fade }, t - fade);
            tl.to(dots[i - 1], { scale: 0.7, backgroundColor: "transparent", duration: fade }, t - fade);
            tl.to(nums[i - 1], { autoAlpha: 0.38, duration: fade }, t - fade);
            tl.fromTo(item, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: fade }, t);
            tl.to(dots[i], { scale: 1.15, backgroundColor: "var(--accent)", duration: fade }, t);
            tl.to(nums[i], { autoAlpha: 1, duration: fade }, t);
            if (!reduce) {
              const lines = item.querySelectorAll(".xp-line");
              if (lines.length) {
                tl.fromTo(lines, { yPercent: 40 }, { yPercent: 0, duration: fade * 0.85 }, t + fade * 0.04);
              }
            }
          });

          if (sticky) {
            sticky.dataset.start = String(absTop);
            sticky.dataset.end = String(absEnd);
          }
          return true;
        };

        const tryMount = () => mount();
        const timers = [160, 420, 900, 1500, 2200].map((ms) => setTimeout(tryMount, ms));
        const iv = setInterval(tryMount, 400);
        const stopIv = setTimeout(() => clearInterval(iv), 5500);
        const onLoad = () => setTimeout(tryMount, 60);
        window.addEventListener("load", onLoad);
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
          stRef.current = null;
        };
      });

      mm.add("(max-width: 899px)", () => {
        gsap.set(".xp-card", { clearProps: "all" });
        gsap.set(".xp-spine-fill", { scaleY: 1 });
        gsap.set(".xp-dot", { scale: 1, backgroundColor: "var(--accent)" });
        gsap.set(".xp-num", { autoAlpha: 1 });
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          ScrollTrigger.batch(".xp-m-enter", {
            start: "top 92%",
            once: true,
            onEnter: (els) =>
              gsap.fromTo(
                els,
                { autoAlpha: 0, y: 14 },
                { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.42, ease: "power2.out" }
              ),
          });
        }
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [n, setActive] }
  );

  const activeJob = career[activeIndex] || career[0];

  return (
    <section id="experience" ref={rootRef} className="xp-pin relative z-0 bg-[var(--bg)]">
      {/* Desktop / large tablet: pinned career story */}
      <div
        className="xp-track relative hidden min-[900px]:block"
        style={{ height: `${Math.max(n, 3) * 78}vh` }}
      >
        <div className="xp-sticky sticky top-0 flex h-[100svh] flex-col overflow-hidden bg-[var(--bg)]">
          <div className="wrap xp-shell flex min-h-0 flex-1 flex-col py-[clamp(1rem,2.2vh,1.75rem)]">
            <header className="xp-intro shrink-0">
              <div className="xp-intro__copy">
                <p className="eyebrow">Career journey</p>
                <h2 className="section-title mt-2">Experience</h2>
                <p className="section-lead xp-intro__lead">
                  Latest first — matching the resume. Each role is its own step, including Kadokohi,
                  Offgrid, and MGC Architecture.
                </p>
              </div>
              <div className="xp-intro__art" aria-hidden="true">
                <svg className="xp-topo" viewBox="0 0 280 120" fill="none">
                  <path
                    d="M8 92c24-28 44-44 68-44s40 22 62 22 38-28 70-28 48 24 64 40"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.35"
                  />
                  <path
                    d="M4 104c28-22 52-36 78-36s44 18 66 18 40-24 72-24 46 20 56 32"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.22"
                  />
                  <path
                    d="M12 78c20-18 40-30 58-30s34 16 52 16 36-22 62-22 48 18 70 34"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.16"
                  />
                </svg>
                <p className="xp-intro__mantra">Build / Learn / Improve / Repeat</p>
              </div>
            </header>

            <div className="xp-compose mt-[clamp(0.75rem,1.8vh,1.25rem)] grid min-h-0 flex-1 gap-[clamp(0.85rem,1.6vw,1.35rem)]">
              <TimelineRail
                career={career}
                activeIndex={activeIndex}
                onSelect={scrollToStep}
                variant="desktop"
              />

              <div className="xp-stage-col min-h-0">
                <div className="xp-stage relative min-h-0 flex-1">
                  {career.map((job, i) => (
                    <RoleCard
                      key={job.role + job.org}
                      job={job}
                      index={i}
                      total={n}
                      mode="desktop"
                      className="absolute inset-0"
                      onPrev={() => scrollToStep(i - 1)}
                      onNext={() => scrollToStep(i + 1)}
                    />
                  ))}
                </div>
                <div className="xp-stage-bottom shrink-0">
                  <BottomPanels job={activeJob} />
                </div>
              </div>

              <div className="xp-snap-col min-h-0">
                <SnapshotCard job={activeJob} />
              </div>
            </div>

            <p className="xp-scroll-hint shrink-0">
              <ChevronsDown size={14} strokeWidth={1.75} aria-hidden="true" />
              Scroll to advance career
              <ChevronsDown size={14} strokeWidth={1.75} aria-hidden="true" />
            </p>
          </div>
        </div>
      </div>

      {/* Mobile / compact: horizontal steps + stacked story */}
      <div className="wrap xp-mobile py-10 min-[900px]:hidden">
        <p className="eyebrow">Career journey</p>
        <h2 className="section-title mt-2">Experience</h2>
        <p className="section-lead">
          Latest first — matching the resume. Kadokohi, Offgrid, and MGC Architecture each own a
          step.
        </p>

        <div className="mt-5">
          <TimelineRail
            career={career}
            activeIndex={activeIndex}
            onSelect={setActive}
            variant="mobile"
          />
        </div>

        <div className="xp-mobile-stack mt-5 space-y-4">
          <div className="xp-m-enter">
            <RoleCard job={activeJob} index={activeIndex} total={n} mode="mobile" />
          </div>
          <div className="xp-m-enter">
            <SnapshotCard job={activeJob} />
          </div>
          <div className="xp-m-enter">
            <BottomPanels job={activeJob} />
          </div>
        </div>

        {/* Full list for verify + a11y parity */}
        <div className="mt-10 space-y-6 border-t border-deep/70 pt-8">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-forest">All roles</p>
          {career.map((job, i) => (
            <RoleCard
              key={`list-${job.role}-${job.org}`}
              job={job}
              index={i}
              total={n}
              mode="mobile"
              className="xp-m-card"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
