import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { education, certifications } from "../data/profile.jsx";

export default function Education() {
  return (
    <section id="education" className="section-pad relative" aria-labelledby="education-heading">
      <div className="wrap">
        <p className="eyebrow">School</p>
        <h2 id="education-heading" className="section-title mt-3">
          Education
        </h2>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <picture>
                    <source srcSet="/logos/dlsu.webp" type="image/webp" />
                    <img
                      src="/logos/dlsu.png"
                      alt="De La Salle University logo"
                      width={44}
                      height={44}
                      decoding="async"
                      className="edu-dlsu-logo h-11 w-11 shrink-0 object-contain"
                    />
                  </picture>
                  <div className="min-w-0">
                    <CardTitle>{education.school}</CardTitle>
                    <p className="text-sm text-soft">
                      {education.degree} · Class of {education.year}
                    </p>
                    <p className="mt-1.5 font-mono text-xs tracking-wide text-forest">
                      CGPA {education.gpa}
                      <span className="mx-1.5 text-soft">·</span>
                      {education.gpaPct} equivalent
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-forest">
                    Honors
                  </p>
                  <ul className="space-y-2.5">
                    {education.honors.map((h) => (
                      <li key={h} className="flex gap-2.5 text-sm text-soft">
                        <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-spring" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-forest">
                    Academic foundations (4 years)
                  </p>
                  <p className="text-sm text-soft">
                    C# / ASP.NET Core, PHP / Laravel, and Python as core coursework through the BS IT program.
                  </p>
                </div>

                <div>
                  <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-forest">
                    Electives
                  </p>
                  <ul className="space-y-2.5">
                    {education.electives.map((e) => (
                      <li key={e} className="flex gap-2.5 text-sm text-soft">
                        <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-pale" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="h-full edu-certs-teaser">
              <CardHeader>
                <CardTitle>Credentials</CardTitle>
                <p className="mt-1 text-sm text-soft">
                  {certifications.length} certifications across engineering, AI, cloud, security, and delivery.
                </p>
              </CardHeader>
              <CardContent>
                <a href="#certifications" className="edu-certs-teaser__link">
                  View full certifications
                  <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
                </a>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
