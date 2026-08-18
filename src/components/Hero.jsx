import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowDown, FileDown } from "lucide-react";
import { Button } from "./ui/button.jsx";
import { profile } from "../data/profile.jsx";
import HeroStage from "./HeroStage.jsx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const pinRef = useRef(null);

  useGSAP(
    () => {
      const root = pinRef.current;
      const draw = root.querySelector(".hero-toolpath__draw");
      const core = root.querySelector(".hero-press__core");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const short = window.matchMedia("(max-height: 520px)").matches;

      const length = draw?.getTotalLength?.() ?? 0;
      if (draw && length) {
        gsap.set(draw, { strokeDasharray: length, strokeDashoffset: length });
      }

      const apply = (p) => {
        root.dataset.p = String(p);
        root.style.setProperty("--hero-p", String(p));
      };

      apply(0);

      gsap.from(".hero-lede > *", {
        y: reduce ? 0 : 18,
        autoAlpha: reduce ? 1 : 0,
        stagger: 0.06,
        duration: 0.55,
        ease: "power3.out",
        delay: 0.04,
        clearProps: "transform",
      });

      if (reduce || mobile || short) {
        root.dataset.motion = "static";
        if (draw) gsap.set(draw, { strokeDashoffset: 0 });
        apply(0);
        return;
      }

      root.dataset.motion = "pin";

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "hero-press",
          trigger: root,
          start: "top top",
          end: "+=220%",
          pin: true,
          pinSpacing: true,
          pinType: "fixed",
          scrub: 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: -30,
          onUpdate: (self) => apply(self.progress),
        },
      });

      if (draw && length) {
        tl.to(draw, { strokeDashoffset: 0, duration: 1 }, 0);
      }
      if (core) {
        tl.fromTo(core, { y: 10 }, { y: -6, duration: 1 }, 0);
      }

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      requestAnimationFrame(refresh);
      return () => window.removeEventListener("load", refresh);
    },
    { scope: pinRef }
  );

  return (
    <section
      id="top"
      ref={pinRef}
      className="hero-pin pin-frame relative z-[1]"
      data-hero="press"
      data-p="0"
      data-motion="pin"
    >
      <div className="hero-sticky pin-viewport">
        <div className="grid-bg absolute inset-0" aria-hidden="true" />
        <div className="hero-glow glow-mint" aria-hidden="true" />

        <div className="hero-shell">
          <div className="hero-lede">
            <p className="eyebrow">Lead Full-Stack · Marikina, PH</p>
            <h1 className="hero-display">
              <span className="hero-display__line">Malcolm Joaquin</span>
              <span className="hero-display__line hero-display__accent">L. Cuady</span>
            </h1>
            <p className="hero-hook">{profile.tagline}</p>
            <div className="hero-cta">
              <Button asChild size="lg" className="group pr-2">
                <a href="#projects">
                  See shipped work
                  <span
                    className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-active:scale-95"
                    aria-hidden="true"
                  >
                    <ArrowDown size={14} strokeWidth={1.5} />
                  </span>
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="group">
                <a href={profile.resumePath} download="Malcolm_Joaquin_Cuady_Resume.pdf">
                  Resume
                  <span
                    className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px"
                    aria-hidden="true"
                  >
                    <FileDown size={14} strokeWidth={1.5} />
                  </span>
                </a>
              </Button>
            </div>
          </div>

          <div className="hero-visual">
            <HeroStage />
          </div>
        </div>
      </div>
    </section>
  );
}
