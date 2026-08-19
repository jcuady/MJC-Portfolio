import { ArrowRight } from "lucide-react";
import { heroStack } from "../../data/profile.jsx";

export default function TechStackCard() {
  return (
    <article className="bento-card stack-card">
      <div className="work-card__head">
        <h2>Technology Stack</h2>
        <a href="#stack">
          More
          <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
        </a>
      </div>
      <div className="stack-card__groups">
        {heroStack.map((group) => (
          <div key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}
