import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

// Register once for the whole app. (MorphSVG is free since GSAP 3.13 — used by
// the hero's dot→logo intro morph. ScrollTo drives the hero auto-flight on
// machines where Lenis is disabled.)
gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin, ScrollToPlugin, useGSAP);

// Avoid recalculating triggers on mobile browser-chrome resize.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, MorphSVGPlugin, useGSAP };
