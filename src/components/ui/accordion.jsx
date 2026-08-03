import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils.js";

function Accordion({ items, className }) {
  const [open, setOpen] = useState(null);

  return (
    <div className={cn("divide-y divide-deep/70 rounded-2xl border border-deep/80 bg-night/40", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-night/60 sm:px-6"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-mist">{item.q}</span>
              <ChevronDown
                size={18}
                className={cn(
                  "shrink-0 text-mint transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-soft sm:px-6">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { Accordion };
