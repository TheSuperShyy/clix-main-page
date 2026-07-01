import { motion } from "motion/react";
import { testimonials } from "../data/content";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";
import { SectionHeading } from "./ui/SectionHeading";

export function Testimonials() {
  return (
    <section id="testimonials" className="relative z-10 scroll-mt-24 bg-ink p-2 sm:p-2.5">
      <div className="pastel-wash overflow-hidden rounded-[1.5rem]">
      <div className="container-x py-24 sm:py-32">
        <SectionHeading
          align="center"
          eyebrow={testimonials.eyebrow}
          title={testimonials.title}
          className="mx-auto"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 grid gap-5 sm:grid-cols-2"
        >
          {testimonials.items.map((t) => (
            <motion.figure
              key={t.name}
              variants={fadeUp}
              className="surface-card relative flex flex-col p-7"
            >
              <span
                aria-hidden
                className="text-gradient mb-2 font-serif text-5xl leading-none"
              >
                &rdquo;
              </span>
              <blockquote className="text-lg leading-relaxed text-fg/90">{t.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-brand to-cyan text-sm font-bold text-bg">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block font-semibold text-fg">{t.name}</span>
                  <span className="block text-sm text-muted">{t.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
      </div>
    </section>
  );
}
