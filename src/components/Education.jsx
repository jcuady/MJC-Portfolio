import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Separator } from "./ui/separator.jsx";
import { education, certifications } from "../data/profile.jsx";

export default function Education() {
  return (
    <section id="education" className="section-pad relative">
      <div className="wrap">
        <p className="eyebrow">Credentials</p>
        <h2 className="section-title mt-3">Education & certifications</h2>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_1.15fr]">
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
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-spring/30 bg-spring/10 text-spring">
                    <Award size={18} aria-hidden="true" />
                  </span>
                  <CardTitle>Certifications</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul>
                  {certifications.map((c, i) => (
                    <li key={c.name}>
                      {i > 0 ? <Separator className="my-0" /> : null}
                      <div className="flex items-baseline justify-between gap-3 py-3">
                        <div>
                          <p className="text-sm text-mist">{c.name}</p>
                          <p className="text-xs text-forest">{c.org}</p>
                        </div>
                        <span className="shrink-0 font-mono text-xs text-forest">
                          {c.year}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
