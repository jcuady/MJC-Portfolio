import { motion } from "framer-motion";
import { Award, Bookmark, ExternalLink, FileText } from "lucide-react";
import {
  certifications,
  certificationGroups,
  highlightCertifications,
  profile,
} from "../data/profile.jsx";
import CertTrigger from "./CertTrigger.jsx";
import { cn } from "../lib/utils.js";

function CertRow({ cert, featured = false }) {
  return (
    <li className={cn("certs-ledger__row", featured && "is-featured", cert.highlight && "is-highlight")}>
      <CertTrigger cert={cert} variant="row">
        <span className="certs-ledger__main">
          <span className="certs-ledger__icon" aria-hidden="true">
            {featured || cert.highlight ? (
              <Bookmark size={15} strokeWidth={1.75} />
            ) : cert.pdf ? (
              <FileText size={15} strokeWidth={1.75} />
            ) : (
              <Award size={15} strokeWidth={1.75} />
            )}
          </span>
          <span className="certs-ledger__copy">
            <span className="certs-ledger__title">{cert.name}</span>
            <span className="certs-ledger__org">{cert.org}</span>
            {cert.note ? <span className="certs-ledger__note">{cert.note}</span> : null}
          </span>
          <span className="certs-ledger__year">{cert.year || "n/a"}</span>
        </span>
      </CertTrigger>
    </li>
  );
}

export default function Certifications() {
  const featured = highlightCertifications.slice(0, 5);
  const featuredNames = new Set(featured.map((c) => c.name));

  const grouped = certificationGroups.map((g) => ({
    ...g,
    items: certifications.filter((c) => c.group === g.id),
  }));

  return (
    <section id="certifications" className="section-pad certs-section" aria-labelledby="certs-heading">
      <div className="wrap">
        <div className="certs-section__intro">
          <p className="eyebrow">Credentials</p>
          <div className="certs-section__title-row">
            <h2 id="certs-heading" className="section-title mt-3">
              Certifications
            </h2>
            <p className="certs-section__count" aria-label={`${certifications.length} credentials`}>
              <Award size={16} strokeWidth={1.75} aria-hidden="true" />
              <span>{certifications.length}</span>
            </p>
          </div>
          <p className="certs-section__lede">
            Complete credential set ({certifications.length}). Hover for a PDF peek; click to open the
            full certificate. Highlighted rows are the strongest signals for engineering, AI, cloud,
            and delivery roles.
          </p>
        </div>

        <motion.div
          className="certs-ledger certs-ledger--featured"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <header className="certs-ledger__head">
            <span className="certs-ledger__mark" aria-hidden="true">
              <Bookmark size={16} strokeWidth={1.75} />
            </span>
            <div>
              <h3>Highlighted credentials</h3>
              <p>Priority signals for full-stack, AI, cloud, and delivery interviews.</p>
            </div>
          </header>
          <ul className="certs-ledger__list">
            {featured.map((c) => (
              <CertRow key={c.name} cert={c} featured />
            ))}
          </ul>
        </motion.div>

        <div className="certs-section__groups">
          {grouped.map((group, gi) => (
            <motion.div
              key={group.id}
              className="certs-ledger"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: gi * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <header className="certs-ledger__head certs-ledger__head--compact">
                <h3>{group.label}</h3>
                <span className="certs-ledger__count">{group.items.length}</span>
              </header>
              <ul className="certs-ledger__list">
                {group.items.map((c) => (
                  <CertRow key={c.name} cert={c} featured={featuredNames.has(c.name) && c.highlight} />
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="certs-section__foot">
          Prefer LinkedIn proofs?{" "}
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            View on LinkedIn
            <ExternalLink size={12} strokeWidth={1.75} aria-hidden="true" />
          </a>
        </p>
      </div>
    </section>
  );
}
