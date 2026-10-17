import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "./ui/card.jsx";
import { Badge } from "./ui/badge.jsx";
import SitePreview from "./SitePreview.jsx";
import { featuredProjects, otherProjects, projects } from "../data/profile.jsx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function ProjectCard({ project, index }) {
  const Wrapper = project.url ? "a" : "div";
  const wrapperProps = project.url
    ? { href: project.url, target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <article className="proj-card h-full">
      <Wrapper {...wrapperProps} className="group block h-full min-w-0">
        <Card className="h-full overflow-hidden transition-colors duration-200 hover:border-mint/55">
          <SitePreview project={project} className="aspect-[16/10] border-b border-deep/70" />
          <CardContent className="p-4 sm:p-6">
            <div className="flex min-w-0 items-start justify-between gap-2">
              <span className="font-mono text-xs tracking-[0.16em] text-forest">
                {project.index}
              </span>
              <Badge variant="default" className="max-w-[60%] shrink truncate text-left">
                {project.status}
              </Badge>
            </div>
            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-display text-lg font-semibold tracking-tight text-mist sm:text-xl">
                  {project.name}
                </h3>
                <p className="mt-0.5 text-sm text-soft">{project.kind}</p>
              </div>
              {project.url ? (
                <ArrowUpRight
                  size={18}
                  className="mt-1 shrink-0 text-forest transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mint"
                  aria-hidden="true"
                />
              ) : null}
            </div>
            <p className="proj-card__desc mt-3 text-sm leading-relaxed text-soft">{project.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </Wrapper>
    </article>
  );
}

function FeaturedCase({ project, index }) {
  const flip = index % 2 === 1;
  const Wrapper = project.url ? "a" : "div";
  const wrapperProps = project.url
    ? { href: project.url, target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <article
      className={`feat-case grid min-w-0 items-center gap-4 overflow-hidden sm:gap-6 md:grid-cols-2 md:gap-10 lg:gap-14 ${
        flip ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className="min-w-0">
        <Wrapper {...wrapperProps} className="group block">
          <div className="overflow-hidden rounded-2xl border border-deep/70 bg-night/40 shadow-[0_24px_60px_-40px_rgba(13,28,21,0.55)] transition-colors duration-200 group-hover:border-mint/50">
            <SitePreview
              project={project}
              priority={index === 0}
              className="aspect-[16/10] sm:aspect-[16/9]"
            />
          </div>
        </Wrapper>
      </div>

      <div className={`feat-copy min-w-0 ${flip ? "md:text-right" : ""}`}>
        <p className="eyebrow feat-case__accent">{project.accent || "Unique engagement"}</p>
        <div className={`mt-3 flex flex-wrap items-center gap-2 ${flip ? "md:justify-end" : ""}`}>
          {project.logo ? (
            <span className="feat-case__logo" aria-hidden="true">
              <img src={project.logo} alt="" width={56} height={28} loading="lazy" decoding="async" />
            </span>
          ) : null}
          <span className="font-mono text-xs tracking-[0.16em] text-forest">{project.index}</span>
          <Badge variant="default" className="max-w-full truncate">
            {project.status}
          </Badge>
        </div>
        <h3 className="feat-case__title mt-3 font-display text-[clamp(1.35rem,6vw,2.1rem)] font-bold tracking-tight text-mist sm:text-3xl lg:text-[2.1rem]">
          {project.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-soft sm:text-base">{project.kind}</p>
        <p
          className={`feat-case__desc mt-3 max-w-lg text-sm leading-relaxed text-soft sm:mt-4 sm:text-[15px] ${
            flip ? "md:ml-auto" : ""
          }`}
        >
          {project.desc}
        </p>
        <div className={`mt-4 flex flex-wrap gap-2 sm:mt-5 ${flip ? "md:justify-end" : ""}`}>
          {project.stack.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </div>
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className={`feat-case__cta mt-5 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-deep/80 bg-obsidian/30 px-5 text-sm font-medium text-mist transition-colors hover:border-mint/50 hover:text-mint sm:mt-6 sm:w-auto sm:justify-start sm:border-0 sm:bg-transparent sm:px-0 ${
              flip ? "md:ml-auto md:flex-row-reverse" : ""
            }`}
          >
            Visit live site
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default function Projects() {
  const root = useRef(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.from(".feat-case", {
        autoAlpha: 0,
        y: 36,
        stagger: 0.12,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".feat-list",
          start: "top 82%",
          once: true,
        },
      });

      ScrollTrigger.batch(".proj-card", {
        start: "top 92%",
        once: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.45, ease: "power2.out", overwrite: true }
          ),
      });
    },
    { scope: root }
  );

  return (
    <section id="work" ref={root} className="section-pad relative">
      <span id="projects" className="sr-only" />
      <div className="wrap">
        <p className="eyebrow">
          Shipped work&nbsp;&nbsp;[ {String(projects.length).padStart(2, "0")} ]
        </p>
        <h2 className="section-title mt-3 max-w-2xl">
          Latest products — and every system I have shipped.
        </h2>
        <p className="section-lead max-w-2xl">
          September–October 2026: Pickle Nation, Lasa, Liko, Likha, and Tuko — solo-owned
          builds across booking, F&amp;B ordering, edtech, proptech, and home services.
          Below that: earlier client platforms and NDA suite work.
        </p>

        <div className="feat-list mt-10 space-y-12 sm:mt-12 sm:space-y-14 lg:space-y-16">
          {featuredProjects.map((p, i) => (
            <FeaturedCase key={p.name} project={p} index={i} />
          ))}
        </div>

        <div className="mt-14 sm:mt-16">
          <p className="eyebrow">Platform & additional</p>
          <h3 className="section-title mt-2 text-[clamp(1.35rem,2.5vw,1.85rem)]">
            All projects
          </h3>
          <p className="section-lead">
            NDA suites, ops platforms, and capstone — full list matching the resume.
          </p>
          <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2">
            {otherProjects.map((p, i) => (
              <ProjectCard key={p.name} project={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
