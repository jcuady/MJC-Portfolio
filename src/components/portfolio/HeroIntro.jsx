import { ArrowRight, Mail } from "lucide-react";

export default function HeroIntro() {
  return (
    <article className="bento-card hero-lede hero-intro">
      <p className="hero-pill">
        <span className="hero-pill__dot" aria-hidden="true" />
        Full-stack engineer · Digital transformation partner
      </p>
      <h1 className="hero-display">
        <span className="hero-display__line">Building systems</span>
        <span className="hero-display__line">
          that help businesses <em className="hero-display__scale">scale.</em>
        </span>
      </h1>
      <p className="hero-hook">
        I design, build, and automate digital systems that streamline operations,
        improve customer experiences, and help businesses grow. Engineering + delivery
        ownership, from planning through implementation and deployment.
      </p>
      <div className="hero-cta">
        <a href="#work" className="hero-btn hero-btn--fill group">
          See my work
          <span className="hero-btn__icon" aria-hidden="true">
            <ArrowRight size={14} strokeWidth={1.75} />
          </span>
        </a>
        <a href="#contact" className="hero-btn hero-btn--ghost group">
          <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
          Get in touch
        </a>
      </div>
    </article>
  );
}
