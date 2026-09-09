import { BarChart3, Layers } from "lucide-react";
import { Badge } from "../ui/badge.jsx";

export default function BottomPanels({ job }) {
  const impact = job.impact || [];
  const capabilities = job.capabilities || job.tech || [];

  return (
    <div className="xp-bottom">
      <section className="xp-impact" aria-label="Impact">
        <header className="xp-bottom__head">
          <BarChart3 size={15} strokeWidth={1.75} aria-hidden="true" />
          <h4>Impact</h4>
        </header>
        <ul className="xp-impact__grid">
          {impact.map((item) => (
            <li key={item.label}>
              <p className="xp-impact__label">{item.label}</p>
              <p className="xp-impact__detail">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="xp-caps" aria-label="Core capabilities">
        <header className="xp-bottom__head">
          <Layers size={15} strokeWidth={1.75} aria-hidden="true" />
          <h4>Core capabilities</h4>
        </header>
        <ul className="xp-caps__list">
          {capabilities.map((c) => (
            <li key={c}>
              <Badge variant="muted" className="xp-cap-pill">
                {c}
              </Badge>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
