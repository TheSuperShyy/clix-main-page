import { Suspense, lazy, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { gsap, useGSAP } from "../lib/gsap";
import { stack } from "../data/content";
import { Icon } from "./ui/Icon";
import { BrandMark } from "./ui/BrandMark";

// Real 3D extruded-logo emblem — lazy so three.js stays out of the initial bundle.
const LogoEmblem3D = lazy(() => import("./ui/LogoEmblem3D"));

/**
 * Integrations — "one brain" rotating-orbit hero (CyberCrest-style, LIGHT).
 *
 * A clean white band: editorial copy on the RTL start (right) + a central
 * emblem that is a REAL 3D object — the Clix mark extruded from its own SVG via
 * three.js (see <LogoEmblem3D>), a glossy chrome-black solid spinning on its
 * vertical axis — ringed by the four capability pillars that REVOLVE around the
 * circle (labels counter-rotated to stay upright), with a bright comet sweeping
 * the ring. Below, a monochrome platform strip — the "built on & connected to" row.
 *
 * Motion split (per project skills): framer-motion owns the mount reveals; the
 * emblem is a lazy-loaded react-three-fiber Canvas (its own render loop); GSAP
 * drives the orbit — rotor rotation, per-label counter-rotation and the comet.
 * The ambient motion runs UNGATED by design: it IS the section (and the
 * requested behaviour), and the client reviews on a machine that reports
 * reduced-motion (same call as the VoiceAI / ScrollReveal scroll scenes).
 */

// Pillar anchor points on the orbit ring — four corners (45°, 135°, 225°, 315°
// from top, clockwise). R is the % radius from the orbit centre. Pushed out to
// 44 so the ring reads clearly larger than the emblem (a reference-style
// annular gap) and the chips sit well clear of the spinning emblem.
const R = 44;
const pillarNodes = stack.pillars.map((p, i) => {
  const a = ((45 + i * 90) * Math.PI) / 180;
  return { ...p, x: 50 + R * Math.sin(a), y: 50 - R * Math.cos(a) };
});

export function Integrations() {
  const sectionRef = useRef<HTMLElement>(null);
  const rotorRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cometRef = useRef<SVGGElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12%" },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay },
  });

  useGSAP(
    () => {
      const SPIN = 46; // seconds per orbit revolution
      // The ring of pillars revolves…
      if (rotorRef.current) {
        gsap.to(rotorRef.current, {
          rotation: 360,
          transformOrigin: "50% 50%",
          duration: SPIN,
          ease: "none",
          repeat: -1,
        });
      }
      // …while each label counter-rotates to stay upright and readable.
      labelRefs.current.forEach((el) => {
        if (!el) return;
        gsap.to(el, {
          rotation: -360,
          transformOrigin: "50% 50%",
          duration: SPIN,
          ease: "none",
          repeat: -1,
        });
      });
      // (The emblem's 3D dimensional tilt is owned by framer-motion below — GSAP
      // must not also write its transform, or the two engines would fight.)
      // The glowing comet group sweeps the ring (head-first, clockwise).
      if (cometRef.current) {
        gsap.to(cometRef.current, {
          rotation: 360,
          svgOrigin: "50 50",
          duration: 9,
          ease: "none",
          repeat: -1,
        });
      }
      // The credential strip is an infinite marquee — the track holds FOUR
      // identical tool sets (so even ultrawide viewports can't outrun it), and
      // shifting left by exactly one set (xPercent -25) loops seamlessly.
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -25,
          duration: 38, // one full set per pass — calm credential-ticker pace
          ease: "none",
          repeat: -1,
        });
      }
    },
    { scope: sectionRef },
  );

  const cta = stack.ctas[0];

  return (
    <section
      ref={sectionRef}
      id="integrations"
      className="relative z-10 flex min-h-dvh flex-col overflow-hidden bg-bg text-fg"
    >
      {/* backdrop — airy brand-spectrum glow behind the orbit (end side) + faint grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-[10%] end-[4%] size-[42vw] max-w-2xl rounded-full opacity-[0.10] blur-[130px]"
          style={{ background: "radial-gradient(circle, var(--color-brand), transparent 65%)" }}
        />
        <div
          className="absolute bottom-[-14%] end-[22%] size-[32vw] max-w-xl rounded-full opacity-[0.10] blur-[130px]"
          style={{ background: "radial-gradient(circle, var(--color-green), transparent 65%)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.04,
            backgroundImage:
              "linear-gradient(var(--color-fg) 1px, transparent 1px), linear-gradient(90deg, var(--color-fg) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 70% 42%, #000, transparent 72%)",
            maskImage: "radial-gradient(ellipse 60% 60% at 70% 42%, #000, transparent 72%)",
          }}
        />
      </div>

      <div className="container-x relative flex flex-1 flex-col py-16 sm:py-20">
        <div className="grid flex-1 items-center gap-x-12 gap-y-16 lg:grid-cols-2">
          {/* Copy — RTL start (right); nudged a touch left on desktop (translate,
              so the column width / headline wrapping is unchanged). */}
          <div className="lg:-translate-x-10">
            <motion.p {...rise(0)} className="eyebrow inline-flex items-center gap-2 text-brand">
              <span className="size-1.5 rounded-full brand-gradient" />
              {stack.kicker}
            </motion.p>

            <motion.h2 {...rise(0.06)} className="mt-5 text-balance text-h1 text-fg">
              {stack.introTitle}{" "}
              <span className="text-gradient">{stack.introTitleAccent}</span>
            </motion.h2>

            <motion.p {...rise(0.12)} className="mt-6 max-w-xl text-lead text-muted">
              {stack.introSubtitle}
            </motion.p>

            <motion.div {...rise(0.18)} className="mt-9">
              <a
                href={cta.href}
                className="group inline-flex items-center gap-2.5 rounded-full bg-brand px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_16px_36px_-14px_rgba(36,84,245,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                {cta.label}
                <Icon
                  name="arrow"
                  size={17}
                  className="transition-transform duration-300 group-hover:-translate-x-0.5"
                />
              </a>
            </motion.div>

            {/* Credential strip — the platforms Clix builds on / connects to.
                Sits directly UNDER the CTA and is width-capped to the copy
                column (max-w-xl → same left edge as the subtitle above), so its
                left edge lands on the column gutter and never reaches the orbit
                in the end column. dir=ltr keeps the loop maths + Latin brand
                names predictable; text-start keeps the label aligned to the RTL
                copy above. The track holds FOUR identical tool sets and shifts
                by exactly one set (xPercent -25) to loop seamlessly. */}
            <motion.div
              {...rise(0.24)}
              className="mt-11 max-w-xl border-t border-border pt-6"
            >
              <div
                dir="ltr"
                className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]"
              >
                <div ref={marqueeRef} dir="ltr" className="flex w-max">
                  {[0, 1, 2, 3].map((dup) => (
                    <ul
                      key={dup}
                      aria-hidden={dup > 0}
                      className="flex shrink-0 items-center gap-x-9 pe-9 sm:gap-x-11 sm:pe-11"
                    >
                      {stack.tools.map((t) => (
                        <li
                          key={t.name}
                          className="group flex items-center text-muted opacity-80 transition-[color,opacity] duration-200 hover:text-fg hover:opacity-100"
                        >
                          <BrandMark name={t.name} />
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Rotating orbit — RTL end (left) */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[580px] lg:max-w-[650px] lg:justify-self-center"
          >
            {/* single thin ring + a glowing comet that sweeps it (reference-style) */}
            <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full">
              <defs>
                {/* tail→head fade for the comet; objectBoundingBox so it rotates with the arc */}
                <linearGradient id="cometGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0" />
                  <stop offset="65%" stopColor="var(--color-brand)" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="1" />
                </linearGradient>
                <filter id="cometGlow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="1.1" />
                </filter>
              </defs>

              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--color-fg)" strokeOpacity="0.12" strokeWidth="0.3" />

              {/* comet — a ~55° glowing arc (soft glow underlay + gradient core + bright head),
                  rotated as one group by GSAP so the whole streak sweeps the ring. */}
              <g ref={cometRef}>
                <path
                  d="M 29.68 10.97 A 44 44 0 0 1 70.32 10.97"
                  fill="none"
                  stroke="var(--color-brand)"
                  strokeOpacity="0.35"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  filter="url(#cometGlow)"
                />
                <path
                  d="M 29.68 10.97 A 44 44 0 0 1 70.32 10.97"
                  fill="none"
                  stroke="url(#cometGrad)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
                <circle cx="70.32" cy="10.97" r="1" fill="var(--color-brand)" filter="url(#cometGlow)" />
                <circle cx="70.32" cy="10.97" r="0.55" fill="#ffffff" />
              </g>
            </svg>

            {/* central "one brain" emblem — a REAL 3D extruded logo spinning on
                its vertical axis (three.js). Transparent + pointer-events-none so
                the orbit rings/chips behind stay visible and clickable. */}
            <div
              role="img"
              aria-label={stack.emblemAlt}
              className="pointer-events-none absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 sm:size-[420px] lg:size-[480px]"
            >
              <div
                aria-hidden
                className="brand-gradient absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl sm:size-64 lg:size-80"
              />
              <Suspense
                fallback={
                  <img
                    src="/clix-logo.png"
                    alt=""
                    aria-hidden
                    draggable={false}
                    className="absolute left-1/2 top-1/2 w-28 -translate-x-1/2 -translate-y-1/2 select-none opacity-90 sm:w-48 lg:w-60"
                  />
                }
              >
                <LogoEmblem3D />
              </Suspense>
            </div>

            {/* revolving pillar chips — readable pill (border + surface + soft
                shadow + gradient icon badge), counter-rotated so the label stays
                upright as it revolves. Sits on the R=40 ring, clear of the emblem. */}
            <div ref={rotorRef} className="absolute inset-0">
              {pillarNodes.map((n, i) => (
                <div key={n.label} className="absolute" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
                  <div className="-translate-x-1/2 -translate-y-1/2">
                    <div
                      ref={(el) => {
                        labelRefs.current[i] = el;
                      }}
                    >
                      <div className="flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2 py-1 shadow-[0_6px_18px_-8px_rgba(11,14,20,0.22)] sm:gap-2 sm:px-3 sm:py-1.5">
                        <span className="brand-gradient grid size-4 place-items-center rounded-full text-white sm:size-6">
                          <Icon name={n.icon} size={13} />
                        </span>
                        <span className="whitespace-nowrap text-[10px] font-semibold text-fg sm:text-xs">
                          {n.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
