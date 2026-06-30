import { motion, useReducedMotion } from "motion/react";
import { valueProp } from "../data/content";

/**
 * ValueProp — the bold statement section right after the hero
 * (on.energy's accent band). It's NOT full-bleed: a charcoal-gray rounded
 * card floats on a black backdrop with a small gap on every side, so the
 * black shows through the rounded corners and side margins. The navbar
 * detects this dark section (#intro) and keeps its tabs light over it.
 */
export function ValueProp() {
  const reduced = useReducedMotion();

  return (
    <section id="intro" className="bg-black p-2 sm:p-2.5">
      <div className="overflow-hidden rounded-[1.5rem] bg-graphite text-white">
        <div className="container-x flex min-h-[80svh] flex-col justify-center py-[22vh] sm:py-[26vh] sm:ps-8 lg:ps-24">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl text-balance text-[clamp(1.75rem,3.6vw,3.25rem)] font-semibold leading-[1.18] tracking-tight"
          >
            {valueProp.body}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
