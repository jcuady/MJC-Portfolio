import { motion } from "framer-motion";
import { Award, ExternalLink, FileText } from "lucide-react";
import { certifications, certificationGroups, profile } from "../data/profile.jsx";
import CertTrigger from "./CertTrigger.jsx";

export default function Certifications() {
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
            Full set of {certifications.length} credentials. Hover a row for a certificate peek; click to open
            the full modal viewer.
          </p>
        </div>

        <div className="certs-section__groups">
          {grouped.map((group, gi) => (
            <motion.div
              key={group.id}
              className="certs-group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: gi * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="certs-group__label">{group.label}</h3>
              <ul className="certs-group__list">
                {group.items.map((c) => (
                  <li key={c.name} className="certs-item">
                    <div className="certs-item__main">
                      <CertTrigger cert={c} variant="ledger">
                        <span className="certs-item__name">
                          {c.pdf ? (
                            <FileText size={15} strokeWidth={1.75} aria-hidden="true" />
                          ) : (
                            <Award size={15} strokeWidth={1.75} aria-hidden="true" />
                          )}
                          <span>{c.name}</span>
                        </span>
                      </CertTrigger>
                      <p className="certs-item__meta">
                        {c.org}
                        {c.credentialId ? ` · ID ${c.credentialId}` : ""}
                        {c.verify ? (
                          <>
                            {" · "}
                            <a
                              href={c.verify}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Verify
                              <ExternalLink size={11} strokeWidth={1.75} aria-hidden="true" />
                            </a>
                          </>
                        ) : null}
                      </p>
                      {c.note ? <p className="certs-item__note">{c.note}</p> : null}
                    </div>
                    {c.year ? (
                      <time className="certs-item__year" dateTime={c.year}>
                        {c.year}
                      </time>
                    ) : (
                      <span className="certs-item__year certs-item__year--empty">n/a</span>
                    )}
                  </li>
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
