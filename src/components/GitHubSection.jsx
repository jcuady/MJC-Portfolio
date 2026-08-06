import { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { Card, CardContent } from "./ui/card.jsx";
import { useTheme } from "../lib/theme.jsx";
import { profile } from "../data/profile.jsx";

export default function GitHubSection() {
  const [chartFailed, setChartFailed] = useState(false);
  const [statsFailed, setStatsFailed] = useState(false);
  const [langsFailed, setLangsFailed] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";

  const chartColor = isLight ? "264233" : "6DB58B";
  const statsBg = isLight ? "EDF6EE" : "0D1C15";
  const statsText = isLight ? "3D6951" : "A3D3B4";
  const statsTitle = isLight ? "264233" : "6DB58B";
  const statsIcon = isLight ? "3D6951" : "87C4A0";

  return (
    <section id="github" className="section-pad relative">
      <div className="wrap">
        <p className="eyebrow">Open source activity</p>
        <h2 className="section-title mt-3">GitHub</h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="mt-8 sm:mt-10">
            <CardContent className="p-5 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FaGithub size={20} className="text-mist" aria-hidden="true" />
                  <span className="font-mono text-sm text-mist">
                    @{profile.githubUser}
                  </span>
                </div>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs text-mint transition-colors hover:text-pale"
                >
                  github.com/{profile.githubUser} →
                </a>
              </div>

              <div className="mt-6 overflow-x-auto rounded-xl border border-deep/70 bg-obsidian p-3 sm:p-4">
                {chartFailed ? (
                  <p className="py-8 text-center font-mono text-sm text-soft">
                    Graph unavailable — view the live chart on{" "}
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-mint underline"
                    >
                      GitHub
                    </a>
                    .
                  </p>
                ) : (
                  <img
                    key={chartColor}
                    src={`https://ghchart.rshah.org/${chartColor}/${profile.githubUser}`}
                    alt={`${profile.short}'s GitHub contribution graph`}
                    loading="lazy"
                    onError={() => setChartFailed(true)}
                    className="min-w-[560px] sm:min-w-[640px]"
                  />
                )}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {statsFailed ? (
                  <p className="rounded-xl border border-deep/70 px-4 py-8 text-center font-mono text-sm text-soft">
                    Stats unavailable (upstream).{" "}
                    <a href={profile.github} target="_blank" rel="noreferrer" className="text-mint underline">
                      Open GitHub
                    </a>
                  </p>
                ) : (
                  <img
                    key={`stats-${statsBg}`}
                    src={`https://github-readme-stats.vercel.app/api?username=${profile.githubUser}&show_icons=true&hide_border=true&bg_color=${statsBg}&text_color=${statsText}&title_color=${statsTitle}&icon_color=${statsIcon}`}
                    alt="GitHub statistics summary"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full rounded-xl border border-deep/70"
                    onError={() => setStatsFailed(true)}
                    onLoad={(e) => {
                      // Upstream sometimes returns 503 HTML sized like an image; catch blank/tiny paints
                      const img = e.currentTarget;
                      if (img.naturalWidth < 40 || img.naturalHeight < 40) setStatsFailed(true);
                    }}
                  />
                )}
                {langsFailed ? (
                  <p className="rounded-xl border border-deep/70 px-4 py-8 text-center font-mono text-sm text-soft">
                    Language chart unavailable (upstream).{" "}
                    <a href={profile.github} target="_blank" rel="noreferrer" className="text-mint underline">
                      Open GitHub
                    </a>
                  </p>
                ) : (
                  <img
                    key={`langs-${statsBg}`}
                    src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${profile.githubUser}&layout=compact&hide_border=true&bg_color=${statsBg}&text_color=${statsText}&title_color=${statsTitle}`}
                    alt="Most used languages on GitHub"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full rounded-xl border border-deep/70"
                    onError={() => setLangsFailed(true)}
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      if (img.naturalWidth < 40 || img.naturalHeight < 40) setLangsFailed(true);
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
