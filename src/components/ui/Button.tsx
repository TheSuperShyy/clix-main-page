import type { ReactNode } from "react";
import { Icon } from "./Icon";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  withArrow?: boolean;
};

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-300 ease-out cursor-pointer select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  // Ink pill — the strong CTA (SOHub "BOOK A MEETING" / "MENU")
  primary:
    "px-6 py-3 text-on-ink bg-ink hover:bg-ink-2 hover:-translate-y-0.5 shadow-[0_12px_30px_-14px_rgba(18,18,16,0.6)]",
  // Soft pill — secondary action (SOHub "CHAT WITH SOHUB")
  secondary:
    "px-6 py-3 text-fg bg-surface-3 hover:bg-surface-2 border border-transparent hover:border-border-strong",
  ghost: "px-4 py-2 text-muted hover:text-fg",
};

export function Button({ href, children, variant = "primary", className = "", withArrow = false }: ButtonProps) {
  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      {withArrow && (
        <Icon
          name="arrow"
          size={16}
          className="transition-transform duration-300 group-hover:-translate-x-1"
        />
      )}
    </a>
  );
}
