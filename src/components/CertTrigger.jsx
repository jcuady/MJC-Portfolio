import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FileText } from "lucide-react";
import { useCertViewer } from "../lib/certViewer.jsx";

/**
 * Clickable cert row with desktop hover PDF peek + click-to-modal.
 */
export default function CertTrigger({
  cert,
  variant = "list",
  yearClassName = "",
  children,
}) {
  const { openCert } = useCertViewer();
  const tipId = useId();
  const btnRef = useRef(null);
  const hideTimer = useRef(null);
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const clearHide = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const place = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const tipW = 280;
    const tipH = 200;
    const pad = 10;
    let left = r.left;
    let top = r.bottom + 8;
    if (left + tipW > window.innerWidth - pad) left = window.innerWidth - tipW - pad;
    if (left < pad) left = pad;
    if (top + tipH > window.innerHeight - pad) top = Math.max(pad, r.top - tipH - 8);
    setPos({ top, left });
  }, []);

  const showHover = () => {
    // Touch / coarse pointers: CSS hides the peek; click still opens the modal.
    if (!cert.pdf) return;
    clearHide();
    place();
    setHover(true);
  };

  const scheduleHide = () => {
    clearHide();
    hideTimer.current = setTimeout(() => setHover(false), 120);
  };

  useEffect(() => () => clearHide(), []);

  useEffect(() => {
    if (!hover) return undefined;
    const onScroll = () => setHover(false);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [hover]);

  const onActivate = () => openCert(cert);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={`cert-trigger cert-trigger--${variant}`}
        aria-haspopup="dialog"
        aria-describedby={hover ? tipId : undefined}
        onClick={onActivate}
        onMouseEnter={showHover}
        onMouseLeave={scheduleHide}
        onFocus={showHover}
        onBlur={scheduleHide}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onActivate();
          }
        }}
      >
        {children ?? (
          <>
            <span className="cert-trigger__label">
              <FileText size={14} strokeWidth={1.7} aria-hidden="true" />
              <span>{cert.name}</span>
            </span>
            {cert.year ? <em className={yearClassName}>{cert.year}</em> : <em className={yearClassName}>n/a</em>}
          </>
        )}
      </button>

      {hover && cert.pdf && typeof document !== "undefined"
        ? createPortal(
            <div
              id={tipId}
              role="tooltip"
              className="cert-hover-peek"
              style={{ top: pos.top, left: pos.left }}
              onMouseEnter={clearHide}
              onMouseLeave={scheduleHide}
            >
              <p className="cert-hover-peek__title">{cert.name}</p>
              <div className="cert-hover-peek__frame">
                <iframe
                  title={`${cert.name} preview`}
                  src={`${encodeURI(cert.pdf)}#page=1&view=FitH&toolbar=0&navpanes=0`}
                  tabIndex={-1}
                />
              </div>
              <p className="cert-hover-peek__hint">Click to open full certificate</p>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
