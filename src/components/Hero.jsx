import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import HeroIntro from "./portfolio/HeroIntro.jsx";
import ProofStrip from "./portfolio/ProofStrip.jsx";
import ProfileCard from "./portfolio/ProfileCard.jsx";
import TransformationCard from "./portfolio/TransformationCard.jsx";
import RecruiterCard from "./portfolio/RecruiterCard.jsx";
import SelectedWorkCard from "./portfolio/SelectedWorkCard.jsx";
import TechStackCard from "./portfolio/TechStackCard.jsx";
import SystemCard from "./portfolio/SystemCard.jsx";
import UiUxCard from "./portfolio/UiUxCard.jsx";
import IndustryPlaceholderStrip from "./portfolio/IndustryPlaceholderStrip.jsx";

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const root = rootRef.current;
      if (!root) return;
      root.dataset.motion = "static";
      if (reduce) return;

      const lines = root.querySelectorAll(".hero-display__line");
      const hook = root.querySelector(".hero-hook");
      const ctas = root.querySelectorAll(".hero-cta a");
      const proof = root.querySelectorAll(".hero-proof li");
      const cards = root.querySelectorAll(".bento-card");
      const portrait = root.querySelector(".profile-card__shot img");

      gsap.from(".hero-pill", {
        y: 10,
        autoAlpha: 0,
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.from(lines, {
        y: 14,
        autoAlpha: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: "power3.out",
        delay: 0.05,
      });
      if (hook) {
        gsap.from(hook, { y: 12, autoAlpha: 0, duration: 0.45, delay: 0.12, ease: "power3.out" });
      }
      gsap.from(ctas, {
        y: 10,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 0.4,
        delay: 0.16,
        ease: "power3.out",
      });
      gsap.from(proof, {
        y: 10,
        autoAlpha: 0,
        stagger: 0.04,
        duration: 0.4,
        delay: 0.2,
        ease: "power3.out",
      });
      gsap.from(cards, {
        y: 12,
        autoAlpha: 0,
        stagger: 0.04,
        duration: 0.45,
        ease: "power3.out",
        delay: 0.1,
      });
      if (portrait) {
        gsap.from(portrait, {
          scale: 0.97,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
        delay: 0.2,
        });
      }
    },
    { scope: rootRef }
  );

  return (
    <section
      id="top"
      ref={rootRef}
      className="hero-pin hero-bento-root"
      data-hero="bento"
      data-motion="static"
    >
      <div className="hero-sticky">
        <div className="hero-bento-wrap">
          <div className="hero-bento-grid">
            <div className="hero-bento-left">
              <HeroIntro />
              <ProofStrip />
            </div>
            <ProfileCard />
            <div className="hero-bento-right">
              <TransformationCard />
              <RecruiterCard />
            </div>
            <div className="hero-bento-bottom">
              <SelectedWorkCard />
              <div className="hero-bento-side">
                <TechStackCard />
                <SystemCard />
                <UiUxCard />
              </div>
            </div>
          </div>
          <IndustryPlaceholderStrip />
        </div>
      </div>
    </section>
  );
}
