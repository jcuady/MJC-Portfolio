import { ExternalLink } from "lucide-react";
import SitePreview from "../SitePreview.jsx";
import { isDevelopmentRole, resolveTechList } from "./techStack.js";

function stackId(org) {
  return `xp-stack-${String(org || "role")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}

export default function SnapshotCard({ job }) {
  const project = {
    name: job.snapshotTitle || job.org,
    url: job.url || null,
    preview: job.preview || null,
  };

  const showStack = isDevelopmentRole(job);
  const stack = showStack ? resolveTechList(job.tech || [], 8) : [];
  const labelId = stackId(job.org);

  return (
    <aside className="xp-snap">
      <div className="xp-snap__frame group">
        <SitePreview project={project} className="h-full min-h-[12rem] w-full" chrome />
      </div>

      <div className="xp-snap__body">
        <p className="xp-snap__eyebrow">Project snapshot</p>
        {job.url ? (
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="xp-snap__title"
          >
            {job.snapshotTitle || job.org}
            <ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
          </a>
        ) : (
          <p className="xp-snap__title xp-snap__title--plain">{job.snapshotTitle || job.org}</p>
        )}
        <p className="xp-snap__desc">
          {job.snapshotDesc || job.summary || "Career chapter from the live resume timeline."}
        </p>

        {stack.length > 0 ? (
          <div className="xp-snap__stack">
            <p className="xp-snap__stack-label" id={labelId}>
              Tech stack
            </p>
            <ul className="xp-snap__tech" aria-labelledby={labelId}>
              {stack.map((item) => {
                const Icon = item.Icon;
                return (
                  <li key={item.label} title={item.raw}>
                    <span className="xp-snap__tech-chip">
                      {Icon ? (
                        <Icon
                          className="xp-snap__tech-icon"
                          style={{ color: item.color }}
                          aria-hidden="true"
                        />
                      ) : null}
                      <span>{item.label}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
