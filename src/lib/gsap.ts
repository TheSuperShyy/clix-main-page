import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register once for the whole app.
gsap.registerPlugin(ScrollTrigger, useGSAP);

// Avoid recalculating triggers on mobile browser-chrome resize.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, useGSAP };
