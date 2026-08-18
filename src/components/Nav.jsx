import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Moon, Sun, Menu, X } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Button } from "./ui/button.jsx";
import { useTheme } from "../lib/theme.jsx";
import { profile } from "../data/profile.jsx";

const links = [
  { href: "#projects", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Stack" },
  { href: "#github", label: "GitHub" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-[color-mix(in_srgb,var(--deep)_35%,transparent)] bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] backdrop-blur-xl"
    >
      <nav className="wrap flex h-14 items-center justify-between" aria-label="Primary">
        <a
          href="#top"
          className="flex items-center gap-3 transition-colors hover:opacity-80"
          aria-label="Malcolm Cuady — home"
          onClick={() => setOpen(false)}
        >
          <span className="nav-wordmark">Malcolm Cuady</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs uppercase tracking-[0.18em] text-soft transition-colors duration-200 hover:text-mist"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-soft transition-colors hover:bg-night hover:text-mist"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="hidden h-11 w-11 items-center justify-center rounded-full text-soft transition-colors hover:text-mist sm:inline-flex"
          >
            <FaGithub size={18} />
          </a>
          <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
            <a href={profile.resumePath} download="Malcolm_Joaquin_Cuady_Resume.pdf">
              <Download size={14} aria-hidden="true" />
              Resume
            </a>
          </Button>
          <button
            type="button"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-mist md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-deep/50 bg-obsidian md:hidden"
          >
            <div className="wrap flex flex-col gap-1 py-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-base text-soft transition-colors hover:bg-night hover:text-mist"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={profile.resumePath}
                download="Malcolm_Joaquin_Cuady_Resume.pdf"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-spring px-4 py-3 text-sm font-medium text-obsidian"
              >
                <Download size={14} /> Download resume
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
