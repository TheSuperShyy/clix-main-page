import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { stack } from "../data/content";

/**
 * Integration showcase — static two-column "how it connects" band, styled to a
 * reference: a large media card on the LEFT (RTL end) with the real tool chips
 * clustered along its base, and editorial copy + a single CTA on the RIGHT
 * (RTL start). Was previously the scroll-scrubbed "step inside the video" zoom;
 * converted to a static composition to match the supplied reference.
 *
 * Keeps id="zoom" + bg-ink so the Navbar's dark-section handling is unchanged.
 * A subtly-looping video stands in for the reference's still image (ambient
 * motion is intentionally left ungated — the client reviews on a reduced-motion
 * machine). The fade-in reveals ARE reduced-motion gated.
 */
export function ZoomReveal() {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const cta = stack.ctas[0];

  // Reliable muted autoplay (same muted-property fix as the hero).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const play = () => v.play().catch(() => {});
    play();
    v.addEventListener("canplay", play);
    return () => v.removeEventListener("canplay", play);
  }, []);

  // Shared rise-in reveal (reduced-motion safe).
  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12%" },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
  });

  return (
    <section id="zoom" className="relative z-10 bg-ink">
      <div className="container-x py-24 sm:py-28 lg:py-32">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Media card — left (RTL end); tool chips overlaid along the base. */}
          <motion.div {...rise(0)} className="relative lg:order-2">
            <div
              onContextMenu={(e) => e.preventDefault()}
              className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
            >
              <video
                ref={videoRef}
                className="pointer-events-none h-full w-full object-cover"
                src="/workflow-montage.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                controlsList="nodownload"
                disablePictureInPicture
                tabIndex={-1}
                aria-hidden
              />
              {/* Scrim — keeps the chips legible over any video frame. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
              />
              {/* Tool chips — the real stack, echoing the reference tag cluster. */}
              <ul className="absolute inset-x-5 bottom-5 flex flex-wrap gap-2.5 sm:inset-x-7 sm:bottom-7">
                {stack.tools.map((t, i) => (
                  <motion.li
                    key={t.name}
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-12%" }}
                    transition={{
                      duration: 0.4,
                      delay: 0.2 + i * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="rounded-lg border border-white/25 bg-white/5 px-3.5 py-2 text-xs font-medium uppercase tracking-wide text-white/90 backdrop-blur-sm"
                  >
                    {t.name}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Copy — right (RTL start). */}
          <div className="text-white lg:order-1">
            <motion.span
              {...rise(0)}
              className="eyebrow flex items-center gap-2 text-white/60"
            >
              <span className="size-1.5 rounded-full bg-cyan" />
              {stack.eyebrow}
            </motion.span>

            <motion.h2 {...rise(0.06)} className="mt-5 text-balance text-h2">
              {stack.title}
            </motion.h2>

            <motion.p {...rise(0.12)} className="mt-6 text-lead text-white/75">
              {stack.subtitle}
            </motion.p>

            <motion.p {...rise(0.18)} className="mt-4 text-white/60">
              {stack.body}
            </motion.p>

            <motion.div {...rise(0.24)} className="mt-9">
              <a
                href={cta.href}
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-brand px-7 text-[15px] font-bold text-white shadow-[0_16px_36px_-14px_rgba(46,91,255,0.7)] transition-colors hover:bg-brand-600"
              >
                {cta.label}
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:-translate-x-1"
                >
                  ←
                </span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
