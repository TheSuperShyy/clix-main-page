import { motion } from "motion/react";
import { services } from "../data/content";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";
import { Icon } from "./ui/Icon";

export function Services() {
  return (
    <section id="services" className="relative scroll-mt-24 bg-bg-2 py-24 sm:py-32">
      <div className="container-x">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.2em] text-faint"
          >
            <span className="h-px w-6 bg-faint/60" />
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
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-5 max-w-2xl text-lg leading-relaxed text-muted"
          >
            {services.intro}
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.items.map((item) => (
            <motion.article key={item.index} variants={fadeUp} className="group border-t border-border-strong pt-6">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl border border-border bg-surface-2 text-fg transition-colors group-hover:border-brand/40 group-hover:text-brand">
                  <Icon name={item.icon} size={22} />
                </span>
                <span className="nums text-sm font-semibold text-faint">{item.index}</span>
              </div>

              <h3 className="mt-5 text-xl font-bold text-fg">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.desc}</p>

              <ul className="mt-5 space-y-2.5">
                {item.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm text-fg/80">
                    <Icon name="check" size={15} className="shrink-0 text-brand" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
