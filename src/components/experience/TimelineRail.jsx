import { cn } from "../../lib/utils.js";

/**
 * Sticky career spine — active step driven by GSAP (desktop) or parent state (mobile).
 */
export default function TimelineRail({
  career,
  activeIndex = 0,
  onSelect,
  variant = "desktop",
}) {
  if (variant === "mobile") {
    return (
      <div className="xp-mobile-rail" role="tablist" aria-label="Career steps">
        {career.map((job, i) => {
          const active = i === activeIndex;
          const shortOrg =
            job.org.length > 24 ? `${job.org.slice(0, 22).trim()}…` : job.org;
          return (
            <button
              key={job.org + job.period}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Step ${String(i + 1).padStart(2, "0")}: ${job.org}`}
              className={cn("xp-mobile-step", active && "is-active")}
              onClick={() => onSelect?.(i)}
            >
              <span className="xp-mobile-step__num">{String(i + 1).padStart(2, "0")}</span>
              <span className="xp-mobile-step__org">{shortOrg}</span>
              <span className="xp-mobile-step__date">{job.yearLabel || job.period}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <aside className="xp-rail" aria-label="Career timeline">
      <div className="xp-rail__spine" aria-hidden="true">
        <div className="xp-rail__track" />
        <div className="xp-spine-fill" style={{ transform: "scaleY(0)" }} />
      </div>
      <ol className="xp-rail__list">
        {career.map((job, i) => {
          const active = i === activeIndex;
          return (
            <li
              key={job.org + job.period}
              className={cn("xp-rail__item", active && "is-active")}
              data-step={i}
            >
              <button
                type="button"
                className="xp-rail__btn"
                aria-current={active ? "step" : undefined}
                aria-label={`Step ${String(i + 1).padStart(2, "0")}: ${job.org}`}
                onClick={() => onSelect?.(i)}
              >
                <span className="xp-dot" aria-hidden="true" />
                <span className="xp-rail__meta">
                  <span className="xp-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="xp-rail__period">{job.yearLabel || job.period}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="xp-rail__foot">
        <span>{String(career.length).padStart(2, "0")} roles</span>
        <span className="xp-rail__foot-tag"> · Closer tomorrow</span>
      </p>
    </aside>
  );
}
