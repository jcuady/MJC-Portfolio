import { motion } from "framer-motion";
import { Mail, Phone, FileDown } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Button } from "./ui/button.jsx";
import { Separator } from "./ui/separator.jsx";
import { profile } from "../data/profile.jsx";

export default function Footer() {
  return (
    <footer id="contact" className="section-pad relative border-t border-deep/60">
      <div
        className="glow-mint absolute left-1/2 top-0 h-[45vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/3"
        aria-hidden="true"
      />
      <div className="wrap relative text-center">
        <p className="eyebrow">Contact</p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-4 max-w-2xl font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight"
        >
          Got a manual process?
          <br />
          <span className="text-spring">Let&apos;s ship it.</span>
        </motion.h2>
        <p className="mx-auto mt-5 max-w-md text-soft">
          Open to full-time roles and select freelance builds — full-stack, AI
          platforms, and operations systems.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <a href={`mailto:${profile.email}`}>
              <Mail size={16} aria-hidden="true" />
              {profile.email}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a
              href={profile.resumePath}
              download="Malcolm_Joaquin_Cuady_Resume.pdf"
            >
              <FileDown size={16} aria-hidden="true" />
              Download resume
            </a>
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-soft">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-mist"
          >
            <FaGithub size={16} aria-hidden="true" />
            {profile.githubUser}
          </a>
          <span className="inline-flex items-center gap-2">
            <Phone size={14} aria-hidden="true" />
            {profile.phone}
          </span>
        </div>

        <Separator className="mx-auto mt-16 max-w-md" />
        <p className="mt-6 font-mono text-[11px] tracking-[0.16em] text-forest">
          © {new Date().getFullYear()} {profile.name} · Manila
        </p>
      </div>
    </footer>
  );
}
