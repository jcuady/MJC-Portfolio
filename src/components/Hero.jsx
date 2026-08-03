import { Suspense, lazy, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowDown, FileDown } from "lucide-react";
import { Button } from "./ui/button.jsx";
import { profile, processLayers } from "../data/profile.jsx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const StackScene = lazy(() => import("../three/StackScene.jsx"));

/** Process story — stack stays LEFT; copy RIGHT. Scrubbed fades (not hard cuts). */
const CHAPTERS = [
  {
    id: "intro",
    eyebrow: `${profile.short} · ${profile.location}`,
    title: ["The full", "process."],
    accentLine: 1,
    body: "Not a slogan. Five layers I repeat on every engagement — from messy ops to something running in production.",
    cta: true,
    at: 0,
  },
  {
    id: "unstack",
    eyebrow: "00 — Open",
    title: ["One habit.", "Five layers."],
    accentLine: -1,
    body: "Scroll to peel the stack. Each disc is a real step — not a tech buzzword.",
    at: 0.14,
  },
  {
    id: "analyze",
    eyebrow: "01 — Analyze",
    title: ["I map the", "workflow."],
    accentLine: 0,
    body: "Paper orders, whiteboard queues, spreadsheet costing — find the friction before writing a line of code.",
    at: 0.26,
  },
  {
    id: "design",
    eyebrow: "02 — Design",
    title: ["I design", "custom systems."],
    accentLine: 0,
    body: "Not a template. Ordering, payments, admin, SMS — shaped to how the business already works.",
    at: 0.4,
  },
  {
    id: "build",
    eyebrow: "03 — Build",
    title: ["I ship the", "full stack."],
    accentLine: 0,
    body: "Next.js · React · Node · FastAPI · Supabase — frontend, backend, and data so nothing is orphaned.",
    at: 0.54,
  },
  {
    id: "solve",
    eyebrow: "04 — Solve",
    title: ["I unblock", "and harden."],
    accentLine: 0,
    body: "Payments, RLS, E2E with Playwright, CI — the last 20% that makes the first 80% durable.",
    at: 0.68,
  },
  {
    id: "deliver",
    eyebrow: "05 — Deliver",
    title: ["I leave", "results running."],
    accentLine: 0,
    body: "Live retainers and sold SaaS. Cafe throughput, merch conversion, studio leads — still maintained.",
    at: 0.82,
  },
  {
    id: "close",
    eyebrow: "Outcome",
    title: ["One person.", "Every layer."],
    accentLine: -1,
    body: "From intern to lead — still the same motion: analyze, design, build, solve, deliver.",
    cta: true,
    at: 0.94,
  },
];

function CssStack({ progressRef }) {
  const root = useRef(null);
  useEffect(() => {
    let raf;
    const tick = () => {
      const p = progressRef.current?.p ?? 0;
      const el = root.current;
      if (el) {
        const u = Math.min(1, Math.max(0, (p - 0.1) / 0.14));
        const su = u * u * (3 - 2 * u);
        el.style.setProperty("--spread", `${(8 + su * 18).toFixed(1)}px`);
        el.style.setProperty("--spin", `${(p * 36).toFixed(1)}deg`);
        el.style.setProperty("--tip", `${(26 - su * 12).toFixed(1)}deg`);
        let active = -1;
        if (p >= 0.26 && p < 0.4) active = 0;
        else if (p >= 0.4 && p < 0.54) active = 1;
        else if (p >= 0.54 && p < 0.68) active = 2;
        else if (p >= 0.68 && p < 0.82) active = 3;
        else if (p >= 0.82 && p < 0.94) active = 4;
        el.dataset.active = String(active);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  const mid = (processLayers.length - 1) / 2;
  return (
    <div
      ref={root}
      className="css-stack css-stack--xl"
      data-active="-1"
      aria-hidden="true"
      style={{ "--spread": "8px", "--spin": "0deg", "--tip": "26deg" }}
    >
      {processLayers.map((l, i) => (
        <div
          key={l.id}
          className="css-slab"
          data-i={i}
          style={{ background: l.color, "--o": i - mid }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const pinRef = useRef(null);
  const progressRef = useRef({ p: 0 });
  const stageRef = useRef(0);
  const [stage, setStage] = useState(0);
  const [show3d, setShow3d] = useState(false);

  useEffect(() => {
    const id = window.requestIdleCallback
      ? requestIdleCallback(() => setShow3d(true), { timeout: 1400 })
      : setTimeout(() => setShow3d(true), 300);
    return () =>
      window.cancelIdleCallback ? cancelIdleCallback(id) : clearTimeout(id);
  }, []);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const proxy = progressRef.current;
      proxy.p = 0;

      const sels = CHAPTERS.map((c) => `.chapter-${c.id}`);
      gsap.set(sels, { autoAlpha: 0, y: 12 });
      gsap.set(".chapter-intro", { autoAlpha: 1, y: 0 });
      gsap.set(".chapter-line", { yPercent: 0 });

      if (!reduce) {
        gsap.from(
          ".chapter-intro .chapter-line, .chapter-intro .chapter-eyebrow, .chapter-intro .chapter-body, .chapter-intro .chapter-cta",
          {
            y: 18,
            autoAlpha: 0,
            stagger: 0.035,
            duration: 0.5,
            ease: "power3.out",
            delay: 0.04,
          }
        );
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "hero-stack",
          trigger: pinRef.current,
          start: "top top",
          end: "+=400%",
          pin: true,
          pinSpacing: true,
          pinType: "fixed",
          scrub: reduce ? 0.2 : 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: -30,
          onUpdate: (self) => {
            const p = self.progress;
            let next = 0;
            for (let i = CHAPTERS.length - 1; i >= 0; i--) {
              if (p >= CHAPTERS[i].at - 0.02) {
                next = i;
                break;
              }
            }
            if (next !== stageRef.current) {
              stageRef.current = next;
              setStage(next);
            }
          },
        },
      });

      // Drive 3D / CSS stack — full scrub range
      tl.to(proxy, { p: 1, duration: 1 }, 0);

      // Sequential scrubbed fades: out finishes, then in — scrub interpolates, never hard-cuts,
      // never two chapters fully stacked (exclusive frames + smooth motion).
      const fade = reduce ? 0.04 : 0.07;
      CHAPTERS.forEach((ch, i) => {
        if (i === 0) return;
        const prev = `.chapter-${CHAPTERS[i - 1].id}`;
        const sel = `.chapter-${ch.id}`;
        const t = ch.at;

        tl.to(prev, { autoAlpha: 0, y: -12, duration: fade }, t - fade);
        tl.fromTo(
          sel,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: fade },
          t
        );
        if (!reduce) {
          tl.fromTo(
            `${sel} .chapter-line`,
            { yPercent: 55 },
            { yPercent: 0, stagger: 0.016, duration: fade * 0.95 },
            t + fade * 0.05
          );
        }
      });

      tl.to(".flow-hint", { autoAlpha: 0, duration: 0.05 }, 0.08);

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      requestAnimationFrame(refresh);
      return () => window.removeEventListener("load", refresh);
    },
    { scope: pinRef }
  );

  useEffect(() => {
    if (!show3d) return undefined;
    const t = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(t);
  }, [show3d]);

  return (
    <section id="top" ref={pinRef} className="hero-pin pin-frame relative z-[1]">
      <div className="hero-sticky pin-viewport flex flex-col overflow-hidden">
        <div className="grid-bg absolute inset-0" aria-hidden="true" />
        <div
          className="glow-mint absolute left-[12%] top-[42%] h-[48vmin] w-[48vmin] -translate-y-1/2 opacity-70"
          aria-hidden="true"
        />

        {/* Stack LEFT · copy RIGHT — locked (no flip) */}
        <div className="hero-stage relative z-[1] flex min-h-0 flex-1 flex-col pt-14 md:grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-stretch md:gap-4 md:pt-12 lg:gap-8">
          <div
            className={`hero-visual relative z-[1] order-1 flex min-h-[32svh] items-center justify-center md:min-h-0 ${
              show3d ? "has-3d" : ""
            }`}
          >
            <div className="hero-canvas relative mx-auto w-full max-w-[min(100%,520px)]">
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <CssStack progressRef={progressRef} />
              </div>
              {show3d ? (
                <Suspense fallback={null}>
                  <div className="absolute inset-0 overflow-hidden">
                    <StackScene progressRef={progressRef} />
                  </div>
                </Suspense>
              ) : null}
            </div>
          </div>

          <div className="hero-copy relative z-[2] order-2 flex min-h-[38svh] flex-1 items-center overflow-hidden px-4 pb-14 md:min-h-0 md:h-full md:pb-8 md:pr-8 lg:pr-12">
            {CHAPTERS.map((ch) => (
              <div
                key={ch.id}
                className={`chapter chapter-${ch.id} absolute inset-0 flex items-center overflow-hidden px-1 sm:px-2 ${
                  stage === CHAPTERS.findIndex((c) => c.id === ch.id)
                    ? "pointer-events-auto"
                    : "pointer-events-none"
                }`}
                style={{
                  visibility: ch.id === "intro" ? "visible" : "hidden",
                  opacity: ch.id === "intro" ? 1 : 0,
                }}
                aria-hidden={stage !== CHAPTERS.findIndex((c) => c.id === ch.id)}
              >
                <div className="hero-copy-inner w-full max-w-xl">
                  <p className="chapter-eyebrow eyebrow mb-2 sm:mb-3">{ch.eyebrow}</p>
                  <h1 className="display-huge text-[var(--fg)]">
                    {ch.title.map((line, li) => (
                      <span key={line} className="line-mask block">
                        <span
                          className="chapter-line inline-block"
                          style={ch.accentLine === li ? { color: "var(--spark)" } : undefined}
                        >
                          {line}
                        </span>
                      </span>
                    ))}
                  </h1>
                  <p className="chapter-body mt-3 max-w-md text-sm leading-relaxed text-soft sm:mt-4 sm:text-base">
                    {ch.body}
                  </p>
                  {ch.cta ? (
                    <div className="chapter-cta mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
                      <Button asChild size="lg">
                        <a href="#projects">See shipped work</a>
                      </Button>
                      <Button asChild size="lg" variant="outline">
                        <a href={profile.resumePath} download="Malcolm_Joaquin_Cuady_Resume.pdf">
                          <FileDown size={16} aria-hidden="true" />
                          Resume
                        </a>
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-[3] flex shrink-0 flex-col items-center gap-2 pb-4 sm:pb-5">
          <p className="hidden font-mono text-[10px] tracking-[0.18em] text-forest md:block">
            {processLayers.map((l) => l.label).join(" · ")}
          </p>
          <div
            className="flex items-center gap-1.5"
            role="status"
            aria-label={`Chapter ${stage + 1} of ${CHAPTERS.length}`}
          >
            {CHAPTERS.map((ch, i) => (
              <span
                key={ch.id}
                className="h-1.5 rounded-full transition-[width,background-color] duration-200"
                style={{
                  width: i === stage ? 18 : 6,
                  background: i === stage ? "var(--spark)" : "var(--border)",
                  opacity: i <= stage ? 1 : 0.35,
                }}
              />
            ))}
          </div>
          <div className="flow-hint flex items-center gap-2 text-forest">
            <ArrowDown size={14} aria-hidden="true" />
            <span className="mono-tag">Scroll the story</span>
          </div>
        </div>
      </div>
    </section>
  );
}
