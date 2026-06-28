import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
};

/** Seamless infinite horizontal marquee (content rendered twice, translated -50%). */
export function Marquee({ children, className = "", reverse = false }: Props) {
  return (
    <div
      className={`relative flex overflow-hidden ${className}`}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div
        className="flex shrink-0 items-center gap-4 pe-4 animate-marquee hover:[animation-play-state:paused]"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
