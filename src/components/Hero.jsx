import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowDown, FileDown } from "lucide-react";
import { Button } from "./ui/button.jsx";
import { profile, processLayers } from "../data/profile.jsx";
import HeroPortrait from "./HeroPortrait.jsx";
import ProcessStack from "./ProcessStack.jsx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Portfolio hero — mint/forest MJC. Soft Structuralism + Editorial Split.
 * Chapters are exclusive (one frame at a time) to kill ghosted dual-copy on scrub.
 */
const CHAPTERS = [
  {
    id: "intro",
    eyebrow: "Lead Full-Stack · Marikina, PH",
    title: ["Malcolm Joaquin", "L. Cuady"],
    accentLine: 0,
    body: null,
    portrait: true,
    cta: true,
    at: 0,
  },
  {
    id: "unstack",
    eyebrow: null,
    title: ["One habit.", "Five layers."],
    accentLine: -1,
    body: "Every product starts here. Scroll to peel the stack open.",
    at: 0.12,
  },
  {
    id: "analyze",
    eyebrow: null,
    title: ["I map the", "workflow."],
    accentLine: 0,
    body: "Paper orders, whiteboard queues, spreadsheet costing. Find the friction before writing code.",
    at: 0.26,
    layer: 0,
  },
  {
    id: "design",
    eyebrow: null,
    title: ["I design", "custom systems."],
    accentLine: 0,
    body: "Ordering, payments, admin, SMS - shaped to how the business already works. Not a template.",
    at: 0.4,
    layer: 1,
  },
  {
    id: "build",
    eyebrow: null,
    title: ["I ship the", "full stack."],
    accentLine: 0,
    body: "Next.js, React, Node, FastAPI, Supabase - frontend, backend, and data so nothing is orphaned.",
    at: 0.54,
    layer: 2,
  },
  {
    id: "solve",
    eyebrow: null,
    title: ["I solve", "business problems."],
    accentLine: 0,
    body: "I create solutions that remove friction: payments that clear, queues that move, ops that leave paper.",
    at: 0.68,
    layer: 3,
  },
  {
    id: "deliver",
    eyebrow: null,
    title: ["I leave", "results running."],
    accentLine: 0,
    body: "Sold SaaS and live client products. Cafe throughput, merch conversion, studio leads - shipped.",
    at: 0.82,
    layer: 4,
  },
  {
    id: "close",
    eyebrow: null,
    title: ["One person.", "Every layer."],
    accentLine: -1,
    body: "From intern to lead - same motion: analyze, design, build, solve, deliver.",
    cta: true,
    at: 0.94,
  },
];

const LAYER_ATS = [0.26, 0.4, 0.54, 0.68, 0.82];

function chapterIndexAt(p) {
  let next = 0;
  for (let i = CHAPTERS.length - 1; i >= 0; i--) {
    if (p >= CHAPTERS[i].at - 0.01) {
      next = i;
      break;
    }
  }
  return next;
}

export default function Hero() {
  const pinRef = useRef(null);
  const progressRef = useRef({ p: 0 });
  const stageRef = useRef(0);
  const [stage, setStage] = useState(0);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const proxy = progressRef.current;
      proxy.p = 0;

      const root = pinRef.current;
      const stack = root.querySelector(".process-stack");
      const rig = root.querySelector(".process-stack__rig");
      const slabs = gsap.utils.toArray(".process-slab", root);
      const paraA = root.querySelector(".process-stack__parallax--a");
      const paraB = root.querySelector(".process-stack__parallax--b");
      const glow = root.querySelector(".hero-glow");
      const chapterEls = CHAPTERS.map((c) => root.querySelector(`.chapter-${c.id}`));

      // Hard exclusive chapters — no opacity crossfade (ghost text killer)
      gsap.set(chapterEls, { autoAlpha: 0, y: 0, clearProps: "transform" });
      gsap.set(chapterEls[0], { autoAlpha: 1 });
      gsap.set(".chapter-line", { yPercent: 0, clearProps: "transform" });
      if (stack) gsap.set(stack, { autoAlpha: 1 });

      // Mobile: flat list (no upward 3D fan into the fixed nav). Desktop: CSS 3D peel.
      if (stack) stack.dataset.mode = mobile ? "flat" : "fan";

      const stageEl = root.querySelector(".process-stack__stage");
      const chromeEl = root.querySelector(".process-stack__chrome");
      // Fan fills the stage but never paints under the fixed nav (dark smear killer).
      const measureFanGap = () => {
        const slabH = slabs[0]?.offsetHeight || 64;
        const stageH = stageEl?.clientHeight || 400;
        const stageBox = stageEl?.getBoundingClientRect();
        const navSafe = 72;
        const chromeBottom = chromeEl
          ? chromeEl.getBoundingClientRect().bottom
          : navSafe + 28;
        const floor = Math.max(navSafe + 14, chromeBottom + 8);
        const midY = (stageBox?.top ?? 200) + stageH / 2;
        const maxUp = Math.max(72, midY - floor - slabH / 2);
        const byNav = maxUp / 4;
        const byStage = (stageH * 0.58 - slabH) / 4;
        return Math.round(Math.max(30, Math.min(50, byNav, byStage)));
      };
      const measureCompact = () => Math.max(8, Math.min(14, Math.round(measureFanGap() * 0.24)));
      const shortH = () => window.matchMedia("(max-height: 700px)").matches;
      const tip = () => (shortH() ? 8 : 12);
      const yaw = () => (shortH() ? -6 : -10);

      if (mobile) {
        gsap.set(rig, { rotateX: 0, rotateY: 0, clearProps: "transform" });
        slabs.forEach((slab) => {
          gsap.set(slab, { x: 0, y: 0, z: 0, scale: 1, clearProps: "transform" });
        });
      } else {
        gsap.set(rig, {
          rotateX: tip() * 0.5,
          rotateY: yaw() * 0.35,
          force3D: true,
        });
        slabs.forEach((slab, i) => {
          gsap.set(slab, {
            y: -i * measureCompact(),
            z: i * 8,
            x: 0,
            scale: 1,
            force3D: true,
          });
        });
      }

      if (!reduce) {
        if (!mobile) {
          const c0 = measureCompact();
          gsap.from(slabs, {
            y: (i) => -i * c0 + 32,
            autoAlpha: 0,
            stagger: 0.045,
            duration: 0.7,
            ease: "power3.out",
            delay: 0.03,
          });
        } else {
          gsap.from(slabs, {
            autoAlpha: 0,
            y: 10,
            stagger: 0.035,
            duration: 0.45,
            ease: "power3.out",
            delay: 0.03,
            clearProps: "transform,opacity,visibility",
            onComplete: () => {
              gsap.set(slabs, { autoAlpha: 1, clearProps: "transform" });
            },
          });
        }
        gsap.from(
          ".chapter-intro .chapter-line, .chapter-intro .chapter-eyebrow, .chapter-intro .hero-portrait-wrap, .chapter-intro .chapter-cta",
          {
            y: 14,
            stagger: 0.04,
            duration: 0.5,
            ease: "power3.out",
            delay: 0.08,
            clearProps: "transform",
          }
        );
      }

      const showChapter = (idx) => {
        chapterEls.forEach((el, i) => {
          if (!el) return;
          if (i === idx) {
            gsap.set(el, { autoAlpha: 1, y: 0 });
          } else {
            gsap.set(el, { autoAlpha: 0, y: 0 });
          }
        });
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "hero-stack",
          trigger: pinRef.current,
          start: "top top",
          end: "+=340%",
          pin: true,
          pinSpacing: true,
          pinType: "fixed",
          scrub: reduce ? 0.1 : mobile ? 0.35 : 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: -30,
          onUpdate: (self) => {
            const p = self.progress;
            proxy.p = p;
            const next = chapterIndexAt(p);
            if (next !== stageRef.current) {
              stageRef.current = next;
              showChapter(next);
              setStage(next);
            } else {
              // Hold exclusivity even mid-scrub lag
              showChapter(next);
            }
            let active = -1;
            if (p >= 0.26 && p < 0.94) {
              for (let i = LAYER_ATS.length - 1; i >= 0; i--) {
                if (p >= LAYER_ATS[i] - 0.02) {
                  active = i;
                  break;
                }
              }
            }
            if (stack) stack.dataset.active = String(active);
          },
        },
      });

      if (!mobile) {
        if (paraA && !reduce) {
          tl.to(paraA, { y: -28, x: 10, duration: 1 }, 0);
        }
        if (paraB && !reduce) {
          tl.to(paraB, { y: 20, x: -12, duration: 1 }, 0);
        }
        if (glow && !reduce) {
          tl.to(glow, { yPercent: -6, scale: 1.06, duration: 1 }, 0);
        }

        // Function-based values + invalidateOnRefresh → fan fills stage after resize/orientation.
        tl.to(
          rig,
          {
            rotateX: () => tip(),
            rotateY: () => yaw(),
            duration: 0.12,
          },
          0.1
        );
        slabs.forEach((slab, i) => {
          const fromTop = slabs.length - 1 - i;
          tl.to(
            slab,
            {
              y: () => -fromTop * measureFanGap(),
              z: () => i * 28,
              duration: 0.14,
            },
            0.1
          );
        });

        LAYER_ATS.forEach((at, i) => {
          const side = i % 2 === 0 ? -1 : 1;
          slabs.forEach((slab, j) => {
            const isActive = j === i;
            tl.to(
              slab,
              {
                x: isActive ? side * 18 : 0,
                z: isActive ? 48 + j * 10 : () => j * 28,
                scale: isActive ? 1.04 : 1,
                duration: 0.1,
              },
              at
            );
          });
        });

        tl.to(
          rig,
          {
            rotateX: () => tip() * 0.72,
            rotateY: () => yaw() * 0.55,
            duration: 0.08,
          },
          0.92
        );
        slabs.forEach((slab, i) => {
          const fromTop = slabs.length - 1 - i;
          tl.to(
            slab,
            {
              x: 0,
              y: () => -fromTop * measureFanGap() * 0.94,
              z: () => i * 22,
              scale: 1,
              duration: 0.08,
            },
            0.92
          );
        });
      }

      tl.to(".flow-hint", { autoAlpha: 0, duration: 0.04 }, 0.06);

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      requestAnimationFrame(refresh);
      return () => window.removeEventListener("load", refresh);
    },
    { scope: pinRef }
  );

  const activeLayer =
    CHAPTERS[stage]?.layer != null ? processLayers[CHAPTERS[stage].layer] : null;

  return (
    <section id="top" ref={pinRef} className="hero-pin pin-frame relative z-[1]">
      <div className="hero-sticky pin-viewport flex flex-col overflow-hidden max-md:[contain:none]">
        <div className="grid-bg absolute inset-0" aria-hidden="true" />
        <div
          className="hero-glow glow-mint absolute left-[10%] top-[52%] h-[48vmin] w-[48vmin] -translate-y-1/2 opacity-55 max-md:opacity-40"
          aria-hidden="true"
        />
        <div
          className="hero-glow-soft absolute right-[-6%] top-[28%] h-[36vmin] w-[36vmin] rounded-full opacity-40 max-md:opacity-25"
          aria-hidden="true"
        />

        <div className="hero-stage relative z-[1] flex min-h-0 flex-1 flex-col gap-2 pt-14 max-md:overflow-visible md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center md:gap-5 md:pt-16 md:pl-6 md:pr-4 lg:gap-8 lg:pt-16 lg:pl-10 lg:pr-8 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] xl:gap-10 xl:pl-12 xl:pr-10">
          <div className="hero-visual relative z-[1] order-1 w-full shrink-0 max-md:px-3 md:flex md:min-h-0 md:h-full md:items-center md:justify-center">
            <div className="hero-canvas hero-canvas--tower relative mx-auto w-full max-w-[min(100%,620px)] max-md:min-h-0 md:flex md:h-full md:max-h-[min(78svh,680px)] md:items-center md:justify-center">
              <ProcessStack />
            </div>
          </div>

          <div className="hero-copy relative z-[2] order-2 flex min-h-0 flex-1 items-center overflow-hidden px-4 pb-12 max-md:items-stretch max-md:pb-8 md:h-full md:min-h-0 md:items-center md:pb-8 md:pr-6 lg:pr-8 xl:pr-4">
            {CHAPTERS.map((ch, idx) => (
              <div
                key={ch.id}
                className={`chapter chapter-${ch.id} absolute inset-0 flex items-start overflow-hidden px-1 sm:px-2 md:items-center ${
                  stage === idx ? "pointer-events-auto is-active" : "pointer-events-none"
                }`}
                aria-hidden={stage !== idx}
              >
                <div
                  className={`hero-copy-inner w-full max-w-xl ${
                    ch.id === "intro" ? "hero-intro-inner" : ""
                  }`}
                >
                  {ch.eyebrow ? (
                    <p className="chapter-eyebrow eyebrow mb-2 sm:mb-3">{ch.eyebrow}</p>
                  ) : null}
                  <h1
                    className={`display-huge text-[var(--fg)] ${
                      ch.id === "intro" ? "hero-name" : ""
                    }`}
                  >
                    {ch.title.map((line, li) => (
                      <span key={line} className="line-mask block">
                        <span
                          className="chapter-line inline-block"
                          style={
                            ch.accentLine === li ? { color: "var(--spark)" } : undefined
                          }
                        >
                          {line}
                        </span>
                      </span>
                    ))}
                  </h1>
                  {ch.portrait ? <HeroPortrait /> : null}
                  {ch.body ? (
                    <p className="chapter-body mt-3 max-w-md text-sm leading-relaxed text-soft sm:mt-4 sm:text-base">
                      {ch.body}
                    </p>
                  ) : null}
                  {ch.cta ? (
                    <div
                      className={`chapter-cta flex flex-wrap items-center gap-3 ${
                        ch.id === "intro" ? "mt-4 sm:mt-5" : "mt-5 sm:mt-6"
                      }`}
                    >
                      <Button asChild size="lg" className="group pr-2">
                        <a href="#projects">
                          See shipped work
                          <span
                            className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 group-active:scale-95"
                            aria-hidden="true"
                          >
                            <ArrowDown size={14} strokeWidth={1.5} />
                          </span>
                        </a>
                      </Button>
                      <Button asChild size="lg" variant="outline" className="group">
                        <a
                          href={profile.resumePath}
                          download="Malcolm_Joaquin_Cuady_Resume.pdf"
                        >
                          Resume
                          <span
                            className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105"
                            aria-hidden="true"
                          >
                            <FileDown size={14} strokeWidth={1.5} />
                          </span>
                        </a>
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-chrome relative z-[3] flex shrink-0 flex-col items-center gap-2 pb-4 sm:pb-5">
          <p className="hero-chrome-process hidden font-mono text-xs tracking-[0.18em] text-forest md:block">
            {activeLayer
              ? `${activeLayer.label} · ${activeLayer.short}`
              : processLayers.map((l) => l.label).join(" · ")}
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
            <span className="mono-tag">Scroll the stack</span>
          </div>
        </div>
      </div>
    </section>
  );
}
