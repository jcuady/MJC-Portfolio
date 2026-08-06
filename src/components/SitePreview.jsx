import { useState } from "react";
import { cn } from "../lib/utils.js";

/** Branded mock UI when no screenshot / NDA project. */
function MockPreview({ project }) {
  return (
    <div
      className="flex h-full w-full flex-col gap-3 bg-[var(--bg)] p-5 pt-10"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between">
        <div className="h-2.5 w-28 rounded-full bg-[var(--accent)]" />
        <div className="h-6 w-16 rounded-full border border-[var(--border)]" />
      </div>
      <div className="h-2 w-3/4 rounded-full bg-[var(--border)]" />
      <div className="h-2 w-1/2 rounded-full bg-[var(--border)]" />
      <div className="mt-1 grid flex-1 grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-[var(--border)] bg-[var(--panel)]"
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="h-7 flex-1 rounded-full bg-[var(--accent)]/35" />
        <div className="h-7 w-20 rounded-full border border-[var(--border)]" />
      </div>
      <p className="font-mono text-xs tracking-wider text-[var(--muted)]">
        {project.name}
      </p>
    </div>
  );
}

/**
 * Local screenshot first (public/previews), then branded mock.
 * Never shows third-party paywall error images.
 */
export default function SitePreview({
  project,
  className,
  chrome = true,
  overlay = null,
  priority = false,
}) {
  const [failed, setFailed] = useState(false);
  const src = project.preview || null;
  const host = project.url
    ? project.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")
    : "internal · nda";

  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[var(--bg)]",
        className
      )}
    >
      {chrome ? (
        <div className="absolute inset-x-0 top-0 z-10 flex h-7 items-center gap-1.5 border-b border-[var(--border)]/70 bg-[var(--panel)]/95 px-3 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--border)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--border)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--border)]" />
          <span className="ml-2 truncate font-mono text-xs text-[var(--muted)]">
            {host}
          </span>
        </div>
      ) : null}

      {showImage ? (
        <img
          src={src}
          alt={`Preview of ${project.name}`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          width={1440}
          height={900}
          onError={() => setFailed(true)}
          className={cn(
            "h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.025]",
            chrome && "pt-7"
          )}
        />
      ) : (
        <div className={cn("h-full w-full", chrome && "pt-7")}>
          <MockPreview project={project} />
        </div>
      )}

      {overlay}
    </div>
  );
}
