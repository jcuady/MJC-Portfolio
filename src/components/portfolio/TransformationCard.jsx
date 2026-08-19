import { TrendingUp } from "lucide-react";
import { transformationPillars } from "../../data/profile.jsx";

export default function TransformationCard() {
  return (
    <article className="bento-card transform-card">
      <div className="transform-card__head">
        <h2>Digital Transformation</h2>
        <TrendingUp size={18} strokeWidth={1.6} aria-hidden="true" />
      </div>
      <ul className="transform-card__grid">
        {transformationPillars.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong>
            <span>{item.body}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
