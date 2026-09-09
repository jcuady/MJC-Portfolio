import {
  Briefcase,
  Building2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers3,
  Users,
} from "lucide-react";
import { Badge } from "../ui/badge.jsx";
import { cn } from "../../lib/utils.js";

const META_ICONS = {
  roleType: Building2,
  industry: Briefcase,
  teamSize: Users,
  year: CalendarDays,
};

export default function RoleCard({
  job,
  index,
  total,
  onPrev,
  onNext,
  className,
  mode = "desktop",
}) {
  const step = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");
  const meta = [
    { key: "roleType", label: "Role type", value: job.roleType },
    { key: "industry", label: "Industry", value: job.industry },
    { key: "teamSize", label: "Team size", value: job.teamSize },
    { key: "year", label: "Year", value: job.yearLabel || job.period },
  ].filter((m) => m.value);

  return (
    <article
      className={cn(
        "xp-role-card",
        mode === "desktop" && "xp-card",
        mode === "mobile" && "xp-m-card",
        className
      )}
    >
      <header className="xp-role-card__head">
        <div className="xp-role-card__step">
          <span className="xp-role-card__step-badge">
            <Layers3 size={12} strokeWidth={1.75} aria-hidden="true" />
            Step {step}
          </span>
        </div>
        {mode === "desktop" ? (
          <div className="xp-role-card__pager">
            <button
              type="button"
              className="xp-pager-btn"
              aria-label="Previous role"
              onClick={onPrev}
              disabled={index === 0}
            >
              <ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
            </button>
            <span className="xp-counter font-mono text-xs tracking-[0.14em] text-forest">
              {step} / {totalLabel}
            </span>
            <button
              type="button"
              className="xp-pager-btn"
              aria-label="Next role"
              onClick={onNext}
              disabled={index === total - 1}
            >
              <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <span className="xp-counter font-mono text-xs tracking-[0.14em] text-forest">
            {step} / {totalLabel}
          </span>
        )}
      </header>

      <h3 className="xp-role-card__title">
        <span className="line-mask block">
          <span className="xp-line inline-block">{job.role}</span>
        </span>
      </h3>

      <div className="xp-role-card__org-row">
        {job.logo ? (
          <span
            className={cn(
              "xp-role-card__logo",
              job.logoTone === "dark" && "xp-role-card__logo--dark"
            )}
            aria-hidden="true"
          >
            <img src={job.logo} alt="" width={72} height={32} loading="lazy" decoding="async" />
          </span>
        ) : null}
        {job.url ? (
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="xp-role-card__org"
          >
            {job.org}
            <ExternalLink size={13} strokeWidth={1.75} aria-hidden="true" />
          </a>
        ) : (
          <p className="xp-role-card__org xp-role-card__org--plain">{job.org}</p>
        )}
      </div>
      <dl className="xp-role-card__meta">
        {meta.map((m) => {
          const Icon = META_ICONS[m.key] || Building2;
          return (
            <div key={m.key} className="xp-role-card__meta-item">
              <dt>
                <Icon size={14} strokeWidth={1.7} aria-hidden="true" />
                {m.label}
              </dt>
              <dd>{m.value}</dd>
            </div>
          );
        })}
      </dl>

      {job.summary ? <p className="xp-role-card__summary">{job.summary}</p> : null}

      <ul className="xp-role-card__points">
        {job.points.map((pt) => (
          <li key={pt}>
            <Check size={14} strokeWidth={2} className="xp-role-card__check" aria-hidden="true" />
            <span>{pt}</span>
          </li>
        ))}
      </ul>

      {job.tech?.length ? (
        <ul className="xp-role-card__tech">
          {job.tech.slice(0, 6).map((t) => (
            <li key={t}>
              <Badge variant="outline" className="xp-tech-pill">
                {t}
              </Badge>
            </li>
          ))}
          {job.tech.length > 6 ? (
            <li>
              <Badge variant="muted" className="xp-tech-pill">
                +{job.tech.length - 6} more
              </Badge>
            </li>
          ) : null}
        </ul>
      ) : null}
    </article>
  );
}
