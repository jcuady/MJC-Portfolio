import { Layers, Workflow, ListChecks } from "lucide-react";
import { heroProof } from "../../data/profile.jsx";

const proofIcons = {
  production: Layers,
  saas: Workflow,
  delivery: ListChecks,
};

export default function ProofStrip() {
  return (
    <article className="bento-card hero-proof-card">
      <ul className="hero-proof">
        {heroProof.map((item) => {
          const Icon = proofIcons[item.id] || Layers;
          return (
            <li key={item.id}>
              <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
