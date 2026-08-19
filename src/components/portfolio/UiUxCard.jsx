import { ArrowRight } from "lucide-react";
import { uxFocus } from "../../data/profile.jsx";

export default function UiUxCard() {
  return (
    <article className="bento-card ux-card">
      <h2>UI/UX</h2>
      <p className="ux-card__lead">Design that simplifies complexity.</p>
      <p className="ux-card__body">
        Interfaces for real operations: ordering, POS, bookings, inquiries, and
        checkout. Built for usability on phone and desktop.
      </p>
      <ul>
        {uxFocus.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="ux-card__body ux-card__body--live">
        Live on Kadokohi, Offgrid, MGC Architecture, and Hakum Auto Care.
      </p>
      <a href="#work">
        View UI/UX work
        <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
      </a>
    </article>
  );
}
