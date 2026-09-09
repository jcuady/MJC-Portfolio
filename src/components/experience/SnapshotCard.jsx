import { ExternalLink } from "lucide-react";
import SitePreview from "../SitePreview.jsx";

export default function SnapshotCard({ job }) {
  const project = {
    name: job.snapshotTitle || job.org,
    url: job.url || null,
    preview: job.preview || null,
  };

  return (
    <aside className="xp-snap">
      <div className="xp-snap__frame group">
        <SitePreview project={project} className="h-full min-h-[12rem] w-full" chrome />
      </div>
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
    </aside>
  );
}
