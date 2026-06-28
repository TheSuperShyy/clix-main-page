import { motion } from "motion/react";
import { work } from "../data/content";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";
import { Icon } from "./ui/Icon";
import { SectionHeading } from "./ui/SectionHeading";

const thumbs = [
  "linear-gradient(135deg, #2a2740, #14141c 70%)",
  "linear-gradient(135deg, #123842, #0f1418 70%)",
  "linear-gradient(135deg, #2e2533, #161218 70%)",
  "linear-gradient(135deg, #20303a, #111418 70%)",
];

export function Work() {
  return (
    <section id="work" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading eyebrow={work.eyebrow} title={work.title} subtitle={work.subtitle} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2"
        >
          {work.projects.map((p, i) => (
            <motion.a key={p.title} href="#contact" variants={fadeUp} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
                <div
                  className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ background: thumbs[i % thumbs.length] }}
                />
                <div aria-hidden className="grid-fade absolute inset-0 opacity-30" />

                {/* watermark title */}
                <span className="absolute inset-0 grid place-items-center px-6 text-center text-3xl font-black text-white/10 sm:text-4xl">
                  {p.title}
                </span>

                {p.placeholder && (
                  <span className="absolute end-4 top-4 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[10px] font-medium text-white/80 backdrop-blur">
                    דוגמה
                  </span>
                )}

                <div className="absolute bottom-4 start-4 grid size-12 place-items-center rounded-full bg-white/90 text-ink opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
                  <Icon name="arrow-ne" size={18} />
                </div>
              </div>

              <div className="mt-5 flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-fg transition-colors group-hover:text-brand">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-muted">{p.category}</p>
                </div>
                <span className="nums shrink-0 text-sm text-faint">{p.year}</span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
