import { Children, cloneElement, forwardRef, isValidElement } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-spring text-obsidian hover:brightness-110 shadow-none",
        outline:
          "border border-deep bg-transparent text-mist hover:border-mint hover:bg-night/40",
        ghost: "text-soft hover:bg-night hover:text-mist",
        link: "rounded-none text-mint underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 min-h-11 px-6 text-sm",
        sm: "h-9 min-h-9 px-4 text-xs",
        lg: "h-12 min-h-12 px-7 text-sm sm:px-8",
        icon: "h-11 w-11 min-h-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = forwardRef(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    if (asChild && isValidElement(Children.only(children))) {
      return cloneElement(children, {
        className: cn(classes, children.props.className),
        ref,
        ...props,
      });
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
