import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";

type Props = {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  format?: (v: number) => string;
  className?: string;
};

/** Number that counts up once when scrolled into view (GSAP). */
export function Counter({ to, decimals = 0, prefix = "", suffix = "", format, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const obj = { v: 0 };
      const render = () => {
        el.textContent = format
          ? format(obj.v)
          : `${prefix}${obj.v.toFixed(decimals)}${suffix}`;
      };
      render();
      gsap.to(obj, {
        v: to,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: render,
      });
    },
    { scope: ref, dependencies: [to] },
  );

  const initial = format ? format(0) : `${prefix}${(0).toFixed(decimals)}${suffix}`;
  return (
    <span ref={ref} className={className}>
      {initial}
    </span>
  );
}
