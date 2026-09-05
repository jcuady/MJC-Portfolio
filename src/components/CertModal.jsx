import { useEffect, useId, useRef } from "react";
import { ExternalLink, X } from "lucide-react";

export default function CertModal({ cert, onClose }) {
  const titleId = useId();
  const closeRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!cert) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus(), 40);

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = [
        ...panelRef.current.querySelectorAll(
          'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
        ),
      ].filter((el) => !el.hasAttribute("disabled"));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [cert, onClose]);

  if (!cert) return null;

  const pdfSrc = cert.pdf ? `${encodeURI(cert.pdf)}#view=FitH` : null;

  return (
    <div className="cert-modal" role="presentation">
      <button
        type="button"
        className="cert-modal__backdrop"
        aria-label="Close certificate preview"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="cert-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="cert-modal__head">
          <div className="cert-modal__titles">
            <h2 id={titleId}>{cert.name}</h2>
            <p>
              {cert.org}
              {cert.year ? ` · ${cert.year}` : ""}
              {cert.credentialId ? ` · ID ${cert.credentialId}` : ""}
            </p>
            {cert.note ? <p className="cert-modal__note">{cert.note}</p> : null}
          </div>
          <button
            ref={closeRef}
            type="button"
            className="cert-modal__close"
            aria-label="Close"
            onClick={onClose}
          >
            <X size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </header>

        <div className="cert-modal__frame">
          {pdfSrc ? (
            <iframe title={`${cert.name} certificate PDF`} src={pdfSrc} className="cert-modal__iframe" />
          ) : (
            <div className="cert-modal__empty">
              <p>PDF not uploaded yet for this credential.</p>
              {cert.verify ? (
                <a href={cert.verify} target="_blank" rel="noopener noreferrer">
                  Verify on issuer site
                  <ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
                </a>
              ) : null}
            </div>
          )}
        </div>

        <footer className="cert-modal__actions">
          {pdfSrc ? (
            <a
              className="cert-modal__action cert-modal__action--primary"
              href={encodeURI(cert.pdf)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open PDF
              <ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
            </a>
          ) : null}
          {cert.verify ? (
            <a
              className="cert-modal__action"
              href={cert.verify}
              target="_blank"
              rel="noopener noreferrer"
            >
              Verify
              <ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
            </a>
          ) : null}
          <button type="button" className="cert-modal__action" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
