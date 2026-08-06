import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button.jsx";
import { profile } from "../data/profile.jsx";

/**
 * Consultation intake → mailto (no backend).
 * Opens the user's mail client with a structured draft.
 */
export default function ConsultModal({ open, onClose }) {
  const titleId = useId();
  const firstRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => firstRef.current?.focus(), 40);
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  function submit(e) {
    e.preventDefault();
    setError("");
    const n = name.trim();
    const em = email.trim();
    const msg = message.trim();
    if (!n || !em || !msg) {
      setError("Name, email, and message are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setError("Enter a valid email address.");
      return;
    }

    const subject = encodeURIComponent(`Consultation request — ${n}`);
    const body = encodeURIComponent(
      [
        `Name: ${n}`,
        `Email: ${em}`,
        "",
        "Message:",
        msg,
        "",
        "— Sent from malcolm.cuady portfolio",
      ].join("\n")
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-[var(--fg)]/40 backdrop-blur-[2px]"
        aria-label="Close consultation form"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-deep bg-obsidian p-5 shadow-soft sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-soft">
              Full-time · Digital transformation
            </p>
            <h3 id={titleId} className="mt-1 font-display text-xl font-bold text-mist">
              Book a consultation
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-soft">
              Roles, interviews, or product walkthroughs. Opens your email to{" "}
              {profile.email}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-soft hover:bg-night hover:text-mist"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
          <label className="block text-xs font-medium text-mist">
            Name
            <input
              ref={firstRef}
              type="text"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-deep bg-night px-3 text-sm text-mist outline-none ring-spring/40 focus:ring-2"
              required
            />
          </label>
          <label className="block text-xs font-medium text-mist">
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-deep bg-night px-3 text-sm text-mist outline-none ring-spring/40 focus:ring-2"
              required
            />
          </label>
          <label className="block text-xs font-medium text-mist">
            Message
            <textarea
              name="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What workflow is still manual? What would “scaled” look like?"
              className="mt-1.5 w-full resize-y rounded-xl border border-deep bg-night px-3 py-2.5 text-sm text-mist outline-none ring-spring/40 placeholder:text-soft/60 focus:ring-2"
              required
            />
          </label>

          {error ? (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-1 flex flex-col gap-2 sm:flex-row">
            <Button type="submit" className="flex-1">
              Open email draft
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="sm:w-auto">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
