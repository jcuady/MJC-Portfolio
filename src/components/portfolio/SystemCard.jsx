import { ArrowRight, Award } from "lucide-react";
import { certifications, heroSpecializations, profile } from "../../data/profile.jsx";

export default function SystemCard() {
  const [featured, ...rest] = certifications;

  return (
    <article className="bento-card system-card">
      <div className="work-card__head">
        <h2>Certifications</h2>
        <a href="#education">
          All
          <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
        </a>
      </div>

      <div className="system-card__featured">
        <Award size={16} strokeWidth={1.6} aria-hidden="true" />
        <div>
          <strong>{featured.name}</strong>
          <span>
            {featured.org}
            {featured.year ? `, ${featured.year}` : ""}
          </span>
        </div>
      </div>

      <ul className="system-card__list">
        {rest.map((c) => (
          <li key={c.name}>
            <span>{c.name}</span>
            {c.year ? <em>{c.year}</em> : null}
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
