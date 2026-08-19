import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Moon, Sun, X } from "lucide-react";
import { useTheme } from "../lib/theme.jsx";
import BrandLogo from "./portfolio/BrandLogo.jsx";

const links = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#stack", label: "Stack" },
  { href: "#about", label: "About" },
  { href: "#github", label: "GitHub" },
];

export default function Nav() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const sheetRef = useRef(null);
  const menuBtnRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const sheet = sheetRef.current;
    const focusables = sheet
      ? [...sheet.querySelectorAll("a, button")].filter((el) => !el.hasAttribute("disabled"))
      : [];
    focusables[0]?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtnRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || focusables.length === 0) return;
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
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="nav-bar"
    >
      <nav className="nav-bar__inner" aria-label="Primary">
        <a
          href="#top"
          className="nav-bar__brand"
          aria-label="MJC home"
          onClick={() => setOpen(false)}
        >
          <BrandLogo />
        </a>

        <div className="nav-bar__links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="nav-bar__actions">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="nav-icon-btn"
          >
            {theme === "dark" ? <Sun size={20} strokeWidth={1.75} /> : <Moon size={20} strokeWidth={1.75} />}
          </button>
          <a href="#contact" className="hero-btn hero-btn--fill nav-bar__cta group">
            Let's build together
            <span className="hero-btn__icon" aria-hidden="true">
              <ArrowRight size={13} strokeWidth={1.75} />
            </span>
          </a>
          <button
            ref={menuBtnRef}
            type="button"
            className="nav-icon-btn nav-bar__menu"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav-sheet"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X size={20} strokeWidth={1.75} />
            ) : (
              <span className="nav-burger" aria-hidden="true"><span /><span /><span /></span>
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav-sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="nav-sheet"
          >
            <div className="nav-sheet__inner">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                className="hero-btn hero-btn--fill nav-sheet__cta"
                onClick={() => setOpen(false)}
              >
                Let's build together
                <span className="hero-btn__icon" aria-hidden="true">
                  <ArrowRight size={13} strokeWidth={1.75} />
                </span>
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
