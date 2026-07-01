import { motion, useReducedMotion } from "motion/react";
import { valueProp } from "../data/content";

/**
 * ValueProp — the bold statement section right after the hero. It's the WHITE
 * balance card: an off-white rounded card (dark text) floating on the refined
 * dark (ink) backdrop, so it pops as a bright break between the dark hero and
 * the dark zoom section. The navbar uses its dark treatment over it (#intro is
 * NOT in the navbar's DARK_SECTIONS anymore).
 */
export function ValueProp() {
  const reduced = useReducedMotion();

  return (
    <section id="intro" className="bg-ink p-2 sm:p-2.5">
      <div className="overflow-hidden rounded-[1.5rem] bg-bg-2 text-fg">
        <div className="container-x flex min-h-[calc(100svh-1.5rem)] flex-col justify-center py-[18vh] sm:py-[22vh] sm:ps-8 lg:ps-24">
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
