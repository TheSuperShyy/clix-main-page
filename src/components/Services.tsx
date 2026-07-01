import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { gsap } from "../lib/gsap";
import { services } from "../data/content";
import { viewportOnce } from "../lib/motion";

/**
 * Services — adapted from the "services with animated hover modal" component
 * (Olivier-Larose / cnippet pattern). Rebuilt for this project: Vite (not
 * Next.js), RTL Hebrew, our design tokens, copy from `content.ts`.
 *
 * Each row is a service; hovering a row floats a cursor-following image panel
 * (GSAP quickTo) + a brand "צפייה" bubble (Framer scale). The panel/cursor use
 * `position: fixed` + clientX/clientY so they track correctly no matter what
 * positioned / overflow-hidden / transformed ancestors the card sits inside.
 *
 * Pointer-only by nature (hover + mousemove) — on touch it degrades to a clean
 * tappable list, which is the correct responsive behavior.
 */

// Presentational media per service (matched to `services.items` order).
// Stable, long-lived Unsplash classics — AI / code / network / data imagery.
const MEDIA = [
  // 01 · Voice AI  → circuit macro
  { img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=520&q=80", tint: "#0a1730" },
  // 02 · Web + Mobile → code on screen
  { img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=520&q=80", tint: "#0b1220" },
  // 03 · Automations → blue network / globe
  { img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=520&q=80", tint: "#071427" },
  // 04 · CRM + WhatsApp → data streams
  { img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=520&q=80", tint: "#04140c" },
] as const;

const scaleAnimation = {
  initial: { scale: 0, x: "-50%", y: "-50%" },
  enter: {
    scale: 1,
    x: "-50%",
    y: "-50%",
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] as const },
  },
  closed: {
    scale: 0,
    x: "-50%",
    y: "-50%",
    transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] as const },
  },
};

type ModalState = { active: boolean; index: number };

export function Services() {
  const [modal, setModal] = useState<ModalState>({ active: false, index: 0 });

  return (
    <section id="services" className="relative z-10 scroll-mt-24 bg-ink">
      <div className="overflow-hidden bg-bg">
        <div className="container-x py-16 sm:py-20">
          {/* Header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.6 }}
                className="eyebrow inline-flex items-center gap-2 text-brand"
              >
                <span className="size-1.5 rounded-full bg-brand" />
                {services.eyebrow}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="mt-5 text-balance text-h2 font-extrabold text-fg"
              >
                {services.title}
              </motion.h2>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-md text-lead text-muted"
            >
              {services.intro}
            </motion.p>
          </div>

          {/* Interactive rows */}
          <div className="mt-10 flex flex-col sm:mt-12">
            {services.items.map((item, index) => (
              <Row
                key={item.index}
                index={index}
                title={item.title}
                num={item.index}
                href="#contact"
                setModal={setModal}
              />
            ))}
          </div>
        </div>
      </div>

      <Modal modal={modal} />
    </section>
  );
}

function Row({
  index,
  title,
  num,
  href,
  setModal,
}: {
  index: number;
  title: string;
  num: string;
  href: string;
  setModal: (m: ModalState) => void;
}) {
  return (
    <a
      href={href}
      aria-label={title}
      className="group flex cursor-pointer items-center justify-between border-t border-border py-5 transition-opacity duration-200 last:border-b hover:opacity-60 sm:py-6"
      onMouseEnter={() => setModal({ active: true, index })}
      onMouseLeave={() => setModal({ active: false, index })}
    >
      <h3 className="m-0 text-2xl font-semibold text-fg transition-transform duration-300 group-hover:-translate-x-2.5 sm:text-3xl lg:text-4xl">
        {title}
      </h3>
      <span className="nums text-sm font-semibold text-faint transition-transform duration-300 group-hover:-translate-x-2.5">
        {num}
      </span>
    </a>
  );
}

function Modal({ modal }: { modal: ModalState }) {
  const { active, index } = modal;
  const container = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const cursorLabel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const xContainer = gsap.quickTo(container.current, "left", { duration: 0.8, ease: "power3" });
    const yContainer = gsap.quickTo(container.current, "top", { duration: 0.8, ease: "power3" });
    const xCursor = gsap.quickTo(cursor.current, "left", { duration: 0.5, ease: "power3" });
    const yCursor = gsap.quickTo(cursor.current, "top", { duration: 0.5, ease: "power3" });
    const xLabel = gsap.quickTo(cursorLabel.current, "left", { duration: 0.45, ease: "power3" });
    const yLabel = gsap.quickTo(cursorLabel.current, "top", { duration: 0.45, ease: "power3" });

    // Fixed positioning → track viewport coords (clientX/clientY), so the panel
    // stays under the cursor regardless of scroll or ancestor offsets.
    const onMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      xContainer(clientX);
      yContainer(clientY);
      xCursor(clientX);
      yCursor(clientY);
      xLabel(clientX);
      yLabel(clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      {/* Image panel */}
      <motion.div
        ref={container}
        variants={scaleAnimation}
        initial="initial"
        animate={active ? "enter" : "closed"}
        className="pointer-events-none fixed left-0 top-0 z-40 flex h-72 w-64 items-center justify-center overflow-hidden rounded-xl border border-border bg-bg shadow-2xl sm:h-80 sm:w-72"
      >
        <div
          className="absolute h-full w-full transition-[top] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{ top: `${index * -100}%` }}
        >
          {MEDIA.map((m, idx) => (
            <div
              key={idx}
              className="flex h-full w-full items-center justify-center"
              style={{ backgroundColor: m.tint }}
            >
              <img
                src={m.img}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Cursor disc */}
      <motion.div
        ref={cursor}
        variants={scaleAnimation}
        initial="initial"
        animate={active ? "enter" : "closed"}
        className="pointer-events-none fixed left-0 top-0 z-40 grid size-20 place-items-center rounded-full bg-brand text-sm font-light text-on-ink"
      />
      {/* Cursor label */}
      <motion.div
        ref={cursorLabel}
        variants={scaleAnimation}
        initial="initial"
        animate={active ? "enter" : "closed"}
        className="pointer-events-none fixed left-0 top-0 z-40 grid size-20 place-items-center rounded-full bg-transparent text-sm font-light text-on-ink"
      >
        צפייה
      </motion.div>
    </>
  );
}
