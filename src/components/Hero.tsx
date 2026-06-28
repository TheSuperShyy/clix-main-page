import { motion } from "motion/react";
import { lazy, Suspense } from "react";
import { hero } from "../data/content";

const HeroLogo3D = lazy(() => import("./HeroLogo3D"));

/** Shown while the 3D bundle streams in (and as a graceful no-WebGL fallback). */
function LogoFallback() {
  return (
    <img
      src="/clix-logo.png"
      alt="הלוגו של Clix"
      className="w-[clamp(220px,32vw,420px)] select-none opacity-90 drop-shadow-[0_30px_40px_rgba(18,18,16,0.3)]"
      draggable={false}
    />
  );
}

function HeroStage() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      {/* ground shadow on the white bg — a soft radial pool below the logo's
          base (darker core, fading out). Narrower than the mark + a gap beneath
          it = floating, lit from above. Sits below/behind the transparent canvas. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[8%] left-1/2 h-12 w-[clamp(170px,24vw,360px)] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(18,18,16,0.40) 0%, rgba(18,18,16,0.20) 42%, transparent 72%)",
          filter: "blur(6px)",
        }}
      />

      {/* interactive 3D canvas (drag to orbit) */}
      <div className="relative z-10 aspect-square w-[clamp(300px,44vw,620px)] cursor-grab active:cursor-grabbing">
        <Suspense fallback={<div className="grid size-full place-items-center"><LogoFallback /></div>}>
          <HeroLogo3D />
        </Suspense>
      </div>

      {/* interaction hint */}
      <span className="pointer-events-none absolute bottom-[5%] text-xs font-medium tracking-wide text-faint/80">
        {hero.dragHint}
      </span>
    </div>
  );
}

function ScrollCue() {
  return (
    <div className="flex items-center gap-3 text-faint">
      <span className="text-xs font-medium tracking-[0.25em]">{hero.scroll}</span>
      <span className="relative block h-12 w-px overflow-hidden bg-faint/40">
        <span className="absolute inset-x-0 top-0 block h-1/2 animate-[scroll-line_1.8s_ease-in-out_infinite] bg-fg" />
      </span>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* 3D logo stage */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="absolute inset-0"
      >
        <HeroStage />
      </motion.div>

      {/* Headline (start) + scroll cue (end), anchored to the bottom.
          pointer-events-none so its tall padding zone doesn't swallow drags on the canvas. */}
      <div className="container-x pointer-events-none relative z-10 mt-auto flex items-end justify-between gap-6 pb-12 pt-40 sm:pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="max-w-2xl text-balance text-h1 font-extrabold leading-[1.02] text-fg"
        >
          {hero.headline}
        </motion.h1>

        <div className="hidden sm:block">
          <ScrollCue />
        </div>
      </div>
    </section>
  );
}
