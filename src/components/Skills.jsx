import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { skillGroups } from "../data/profile.jsx";

const groupVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
};
const chipVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Skills() {
  return (
    <section id="skills" className="section-pad relative">
      <div className="glow-mint absolute -left-40 top-1/4 h-[55vmin] w-[55vmin] opacity-60" aria-hidden="true" />
      <div className="wrap relative">
        <p className="eyebrow">Capabilities</p>
        <h2 className="section-title mt-3">Stack</h2>
        <p className="section-lead">
          Frontend, backend, data, and automation — plus AI-assisted delivery
          with Claude, ChatGPT, and Cursor.
        </p>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {skillGroups.map((group) => (
            <motion.div
              key={group.title}
              variants={groupVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-forest">
                    {group.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2.5">
                    {group.skills.map(({ name, icon: Icon, color }) => (
                      <motion.span
                        key={name}
                        variants={chipVariants}
                        whileHover={{ y: -2 }}
                        className="inline-flex items-center gap-2 rounded-xl border border-deep/80 bg-obsidian/40 px-3.5 py-2.5 text-sm text-mist transition-colors hover:border-mint/40"
                      >
                        <Icon size={16} style={{ color }} aria-hidden="true" />
                        {name}
                      </motion.span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
