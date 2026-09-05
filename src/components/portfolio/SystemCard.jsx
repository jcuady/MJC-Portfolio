import { ArrowRight, Award } from "lucide-react";
import { certifications, heroSpecializations, profile } from "../../data/profile.jsx";
import CertTrigger from "../CertTrigger.jsx";

/** Prefer full-stack as the featured credential for engineering positioning. */
const FEATURED_NAME = "Microsoft Full-Stack Developer Professional Certificate";

export default function SystemCard() {
  const featured =
    certifications.find((c) => c.name === FEATURED_NAME) ?? certifications[0];
  const rest = certifications.filter((c) => c.name !== featured.name);

  return (
    <article className="bento-card system-card">
      <div className="work-card__head">
        <h2>Certifications</h2>
        <a href="#certifications">
          All {certifications.length}
          <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
        </a>
      </div>

      <CertTrigger cert={featured} variant="featured">
        <span className="system-card__featured">
          <Award size={16} strokeWidth={1.6} aria-hidden="true" />
          <span className="system-card__featured-copy">
            <strong>{featured.name}</strong>
            <span>
              {featured.org}
              {featured.year ? `, ${featured.year}` : ""}
            </span>
          </span>
        </span>
      </CertTrigger>

      <ul className="system-card__list" aria-label={`${certifications.length} certifications`}>
        {rest.map((c) => (
          <li key={c.name}>
            <CertTrigger cert={c} variant="compact">
              <span className="cert-trigger__label">{c.name}</span>
              {c.year ? <em>{c.year}</em> : <em>n/a</em>}
            </CertTrigger>
          </li>
        ))}
      </ul>

      <p className="system-card__label">Specializations</p>
      <ul className="system-card__tags">
        {heroSpecializations.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <a
        className="system-card__link"
        href={profile.linkedin}
        target="_blank"
        rel="noreferrer"
      >
        LinkedIn
        <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
      </a>
    </article>
  );
}
