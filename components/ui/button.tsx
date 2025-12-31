import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ve-anim",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-[color-mix(in_srgb,var(--ve-purple-primary)_88%,black)] active:bg-[color-mix(in_srgb,var(--ve-purple-primary)_80%,black)]",
        destructive:
          "bg-destructive text-white hover:bg-[color-mix(in_srgb,var(--ve-danger)_88%,black)] active:bg-[color-mix(in_srgb,var(--ve-danger)_80%,black)] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-2 border-[color-mix(in_srgb,var(--ve-purple-primary)_30%,transparent)] bg-transparent text-[var(--ve-purple-primary)] hover:bg-[color-mix(in_srgb,var(--ve-purple-primary)_8%,transparent)] hover:border-[color-mix(in_srgb,var(--ve-purple-primary)_50%,transparent)] active:bg-[color-mix(in_srgb,var(--ve-purple-primary)_12%,transparent)] dark:border-[color-mix(in_srgb,var(--ve-purple-primary)_40%,transparent)] dark:text-[var(--ve-purple-primary)] dark:hover:border-[color-mix(in_srgb,var(--ve-purple-primary)_60%,transparent)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_srgb,var(--ve-orange-primary)_88%,black)] active:bg-[color-mix(in_srgb,var(--ve-orange-primary)_80%,black)]",
        ghost:
          "hover:bg-accent/50 hover:text-accent-foreground active:bg-accent/70 dark:hover:bg-accent/50",
        link: "text-primary hover:text-[color-mix(in_srgb,var(--ve-orange-primary)_80%,black)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };