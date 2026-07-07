/**
 * Shared hero-scene constants — kept OUT of createHeroScene so eager code
 * (SceneBackdrop's scroll wiring) can import them without statically pulling
 * three + postprocessing into the initial bundle. Importing anything from
 * createHeroScene eagerly re-adds ~840kB to the critical path — don't.
 */

/** Final stop of the scroll sequence (the approved "stop at scrub 52%"). */
export const SEQ_END = 0.52;
