import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-mint/30 bg-mint/10 text-mint",
        outline: "border-deep text-soft",
        muted: "border-transparent bg-obsidian/50 text-forest",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
