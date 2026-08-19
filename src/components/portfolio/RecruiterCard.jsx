import { ArrowDown, Check } from "lucide-react";
import { profile, recruiterHighlights } from "../../data/profile.jsx";

export default function RecruiterCard() {
  return (
    <article className="bento-card recruiter-card">
      <h2>Recruiter Highlights</h2>
      <ul>
        {recruiterHighlights.map((item) => (
          <li key={item}>
            <Check size={14} strokeWidth={2.2} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <a
        className="hero-btn hero-btn--ghost recruiter-card__cta group"
        href={profile.resumePath}
        download="Malcolm_Joaquin_Cuady_Resume.pdf"
      >
        View résumé
        <span className="hero-btn__icon" aria-hidden="true">
          <ArrowDown size={13} strokeWidth={1.75} />
        </span>
      </a>
    </article>
  );
}
