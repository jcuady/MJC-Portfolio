import { motion } from "framer-motion";
import { Mail, Phone, FileDown } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Button } from "./ui/button.jsx";
import { Separator } from "./ui/separator.jsx";
import { profile } from "../data/profile.jsx";

export default function Footer() {
  return (
    <footer id="contact" className="section-pad relative overflow-x-clip border-t border-deep/60">
      <div
        className="glow-mint pointer-events-none absolute left-1/2 top-0 h-[36vmin] w-[70vmin] max-w-[100vw] -translate-x-1/2 -translate-y-1/3 sm:h-[45vmin] sm:w-[60vmin]"
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
          Digital Systems Development Officer at EastWest Bank. Happy to walk
          through shipped systems and prior product work in an interview.
        </p>

        <div className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <a href={`mailto:${profile.email}`} className="max-w-full break-all sm:break-normal">
              <Mail size={16} aria-hidden="true" className="shrink-0" />
              {profile.email}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <a
              href={profile.resumePath}
              download="Malcolm_Joaquin_Cuady_Resume.pdf"
            >
              <FileDown size={16} aria-hidden="true" />
              Download resume
            </a>
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-soft">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-mist"
          >
            <FaLinkedin size={16} aria-hidden="true" />
            LinkedIn
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-mist"
          >
            <FaGithub size={16} aria-hidden="true" />
            {profile.githubUser}
          </a>
          <a
            href={`tel:${profile.phone.replace(/\s+/g, "")}`}
            className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-mist"
          >
            <Phone size={14} aria-hidden="true" />
            {profile.phone}
          </a>
        </div>

        <Separator className="mx-auto mt-16 max-w-md" />
        <p className="mt-6 font-mono text-xs tracking-[0.16em] text-forest">
          © {new Date().getFullYear()} {profile.name} · Manila
        </p>
      </div>
    </footer>
  );
}
