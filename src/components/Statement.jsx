import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { projects } from "../data/profile.jsx";
import SitePreview from "./SitePreview.jsx";
import ConsultModal from "./ConsultModal.jsx";
import { Button } from "./ui/button.jsx";

const lines = ["Doesn't just", "write code."];
const proofs = projects.filter((p) => p.featured).slice(0, 4);

/** Statement — thesis + static live-ops strip + consult CTA. No parallax. */
export default function Statement() {
  const [consultOpen, setConsultOpen] = useState(false);

  return (
    <section
      id="statement"
      className="statement-pin pin-frame relative z-0 overflow-hidden bg-[var(--bg)]"
    >
      <div className="statement-sticky relative flex min-h-[100svh] flex-col justify-center py-16 sm:py-20">
        <div className="wrap flex w-full flex-col gap-6 sm:gap-8 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-12">
          <h2 className="display-huge" aria-label="Doesn't just write code.">
            {lines.map((line) => (
              <span key={line} className="line-mask">
                <span className="st-line inline-block">{line}</span>
              </span>
            ))}
          </h2>

          <div className="st-copy">
            <p className="text-base leading-[1.75] text-soft sm:text-lg">
              Cafes taking orders on paper. Auto shops tracking queues on a
              whiteboard. Studios costing projects by hand. Malcolm analyzes the
              workflow, designs a custom system, ships the full stack, hardens it,
              and stays to maintain it — then helps the next business scale the same
              way.
            </p>
          </div>
        </div>

        <div className="st-gallery wrap mt-8 w-full sm:mt-10" data-testid="proof-gallery">
          <div className="mb-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-soft">
              Live ops → product
            </p>
          </div>

          <div className="relative overflow-x-auto rounded-2xl border border-deep/50 bg-night/35 p-2 sm:p-3">
            <div className="flex gap-3 sm:gap-4">
              {proofs.map((p) => (
                <article
                  key={p.name}
                  className="group relative w-[min(70vw,250px)] shrink-0 overflow-hidden rounded-xl border border-deep/70 bg-obsidian sm:w-[240px]"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <SitePreview project={p} className="h-full w-full object-cover" />
                  </div>
                  <div className="border-t border-deep/50 px-3 py-2.5">
                    <p className="font-display text-sm font-bold text-mist">{p.name}</p>
                    <p className="mt-0.5 text-xs leading-snug text-soft">
                      {p.accent || p.kind}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="wrap mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
          <Button
            type="button"
            size="lg"
            onClick={() => setConsultOpen(true)}
            data-testid="consult-cta"
          >
            Book a consultation
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#projects">See shipped work</a>
          </Button>
          <p className="text-xs leading-relaxed text-soft sm:ml-2 sm:max-w-xs">
            Demo a live system or plan a transformation for the ops you want to scale.
          </p>
        </div>
      </div>

      <ConsultModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </section>
  );
}
