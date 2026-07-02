import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import { getLenis } from "../hooks/useLenis";
import { hero } from "../data/content";

/**
 * Hero — podium.global-style "paper with a logo-shaped hole" zoom.
 *
 *  • A pure-white sheet covers the viewport with the Clix mark cut out of its
 *    center (SVG <mask>: white rect = paper, black logo path = hole). The
 *    hero-montage video plays full-bleed BEHIND the hole.
 *  • On load the hole is a SOLID ROUND DOT at the viewport center; it holds for
 *    ~2s, then MorphSVG reshapes it INTO the Clix logo (same origin the scroll
 *    then dollies through), so dot → logo → "inside" reads as one continuous
 *    motion.
 *  • The load sequence doubles as the site's LOADING SCREEN, and it is a PLAIN
 *    page: just the sheet and the logo hole — no navbar (hidden via a
 *    `.hero-veil` class on <html>, see Navbar.tsx), no on-sheet copy. The h1
 *    lives in the video landing and is OPACITY-driven (never visibility), so
 *    the page keeps its title in the a11y tree from the first paint even for
 *    users who cancel the flight. Once the logo has formed, the page flies itself
 *    down through the hole (auto-scroll to the end of the scrub) and lands
 *    "inside" the full-bleed video — the actual hero — where the veil lifts
 *    and the navbar fades in. The first SCROLL gesture (wheel/touch/scroll-
 *    key/Tab) at ANY point cancels the flight, lifts the veil and hands
 *    control back — and a drift watchdog catches native scrolls those
 *    listeners can't see (scrollbar drag, middle-click autoscroll, find-in-
 *    page). But stray clicks and non-scroll keys (screenshot hotkeys!)
 *    deliberately do NOT cancel: the flight is the loading screen's only
 *    auto-advance, and a stray gesture used to strand the viewer on the paper.
 *  • Scrolling scrubs an exponential dolly: the hole scales up around the
 *    viewport center until the viewer passes "through" it and lands inside the
 *    full-bleed video, where the title + supporting line fade in.
 *  • The loading zoom is ONE-WAY, in two stages. The INSTANT the zoom first
 *    completes (p ≥ 0.999 — flight or manual), a visual latch drops the paper
 *    for good and freezes the stage at the landed state, so scrolling straight
 *    back up (even mid-gesture) can never re-show the loading screen. Then, at
 *    the next scroll SETTLE, the section SEALS geometrically: the 300vh scroll
 *    runway collapses to one viewport, the scroll position is compensated by
 *    exactly the removed distance and every ScrollTrigger refreshes. From then
 *    on the hero is a normal full-screen video band.
 *  • The zoom scales the logo path INSIDE the mask (vector re-render each
 *    frame) rather than a rasterized layer, so the paper edge stays crisp at
 *    any zoom level.
 *  • Sticky + progress-read ScrollTrigger (no `pin:` — see the body-overflow
 *    note in index.css). Runs under reduced-motion by design (scroll-tied;
 *    client tests on a reduced-motion machine).
 */

// The single <path> from public/clix-logo.svg (viewBox 0 0 1728 2304).
const CLIX_PATH =
  "M 621.500 561.656 C 579.345 566.669, 547.943 578.870, 515.596 602.806 C 504.472 611.038, 484.500 630.491, 475.677 641.689 C 466.494 653.343, 443.474 689.906, 423.539 724.500 C 420.369 730, 416.764 736.075, 415.527 738 C 412.477 742.748, 393.894 773.789, 382.003 794 C 366.136 820.968, 360.363 830.697, 337.502 869 C 325.520 889.075, 312.933 910.225, 309.531 916 C 306.130 921.775, 297.107 937.075, 289.480 950 C 241.587 1031.165, 232.045 1050.257, 224.636 1079.737 C 219.840 1098.817, 218.654 1110.626, 219.240 1133.421 C 220.207 1171.057, 227.425 1193.337, 253.768 1240 C 266.704 1262.916, 358.378 1417.216, 396.358 1480 C 403.512 1491.825, 414.732 1510.500, 421.292 1521.500 C 453.142 1574.905, 467.211 1596.667, 480.436 1612.981 C 514.071 1654.477, 567.258 1683.409, 620.143 1688.980 C 625.945 1689.591, 702.933 1689.972, 822.781 1689.983 C 1002.324 1689.999, 1016.108 1689.881, 1016.703 1688.332 C 1017.954 1685.073, 1012.372 1610.044, 1010.411 1603.750 C 1009.593 1601.128, 1008.814 1601.419, 996.504 1608.955 C 957.176 1633.030, 919.812 1644.891, 877 1646.892 C 807.172 1650.155, 752.091 1629.803, 707.797 1584.375 C 692.277 1568.456, 677.965 1547.476, 645.467 1493 C 633.491 1472.925, 620.162 1450.755, 615.846 1443.734 C 611.531 1436.713, 608 1430.814, 608 1430.626 C 608 1430.286, 590.668 1401.449, 556.838 1345.500 C 506.886 1262.888, 498.211 1248.462, 491.295 1236.500 C 487.161 1229.350, 481.626 1220.112, 478.995 1215.970 C 465.241 1194.319, 455.815 1172.033, 452.362 1153 C 450.036 1140.174, 450.061 1114.043, 452.412 1101 C 456.844 1076.412, 461.110 1067.856, 507.505 990.500 C 518.391 972.350, 528.018 956.284, 528.899 954.799 C 529.779 953.313, 532.732 948.363, 535.459 943.799 C 560.309 902.214, 568.439 888.562, 579.705 869.500 C 586.856 857.400, 594.760 844.125, 597.270 840 C 599.779 835.875, 606.538 824.625, 612.288 815 C 675.363 709.433, 686.510 693.064, 711.896 668.733 C 757.226 625.286, 815.301 604.461, 878.709 608.915 C 909.082 611.048, 931.715 617.078, 959.169 630.351 C 983.039 641.890, 997.368 652.217, 1017.555 672.428 C 1037.816 692.714, 1046.147 704.078, 1072.959 748 C 1080.849 760.925, 1089.406 774.875, 1091.974 779 C 1094.542 783.125, 1099.960 792.125, 1104.014 799 C 1108.068 805.875, 1115.740 818.700, 1121.064 827.500 C 1126.387 836.300, 1137.168 854.300, 1145.021 867.500 C 1202.900 964.788, 1216.334 985.222, 1234.500 1003.605 C 1260.622 1030.040, 1286.712 1043.984, 1322.500 1050.640 C 1337.864 1053.498, 1486.050 1053.507, 1490.409 1050.651 C 1495.179 1047.526, 1493.909 1041.070, 1485.535 1025.877 C 1477.021 1010.429, 1431.492 933.966, 1380.514 849.500 C 1365.245 824.200, 1344.102 789.100, 1333.531 771.500 C 1322.959 753.900, 1309.290 731.261, 1303.155 721.191 C 1297.020 711.121, 1292 702.688, 1292 702.451 C 1292 702.214, 1290.088 698.954, 1287.750 695.206 C 1285.412 691.459, 1282.969 687.516, 1282.321 686.446 C 1261.293 651.742, 1251.519 638.639, 1233.852 621.466 C 1205.198 593.613, 1173.056 575.937, 1134 566.554 C 1110.140 560.821, 1118.517 560.987, 861.006 561.150 C 730.928 561.232, 623.150 561.460, 621.500 561.656 M 851.337 664.931 C 843.773 666.167, 844.006 665.286, 843.953 692.872 C 843.771 788.087, 839.693 828.425, 825.883 871.623 C 796.493 963.555, 720.866 1044.205, 626.389 1084.368 C 590.974 1099.423, 563.037 1106.527, 530 1108.877 C 514.616 1109.972, 513.198 1110.350, 511.923 1113.701 C 510.916 1116.352, 510.670 1138.169, 511.609 1141.668 C 512.430 1144.728, 515.692 1145.736, 530.500 1147.501 C 562.588 1151.327, 592.372 1158.947, 620.672 1170.571 C 728.448 1214.841, 804.720 1298.423, 831.861 1402 C 841.162 1437.496, 843.939 1470.763, 843.980 1547.194 L 844 1583.888 846.406 1586.685 L 848.812 1589.482 862.156 1589.491 C 877.930 1589.502, 880.380 1588.975, 881.815 1585.263 C 882.510 1583.465, 883.044 1561.717, 883.342 1523 C 883.874 1453.943, 884.949 1440.584, 892.595 1408 C 921.688 1284.019, 1025.457 1184.787, 1156.512 1155.622 C 1192.618 1147.586, 1205.812 1147.048, 1368 1146.986 C 1513.305 1146.931, 1502.407 1147.465, 1504.065 1140.325 C 1505.336 1134.846, 1505.100 1118.120, 1503.694 1114.026 C 1501.511 1107.673, 1509.805 1108.033, 1364.500 1107.994 C 1198.621 1107.950, 1192.731 1107.616, 1144 1095.493 C 1038.310 1069.199, 946.713 990.440, 908.500 893 C 888.464 841.911, 883.119 803.847, 883.037 711.684 C 883.014 685.469, 882.623 669.163, 881.988 667.978 C 880.069 664.392, 864.254 662.819, 851.337 664.931 M 1350.500 1203.675 C 1309.431 1206.258, 1279.102 1217.816, 1247.930 1242.765 C 1229.171 1257.779, 1214.576 1274.887, 1194.412 1305.500 C 1181.561 1325.009, 1174 1338.700, 1174 1342.461 C 1174 1345.851, 1185.450 1353.891, 1234.500 1384.943 C 1246.050 1392.255, 1257.750 1399.691, 1260.500 1401.468 C 1263.250 1403.245, 1274.725 1410.544, 1286 1417.687 C 1297.275 1424.831, 1314.492 1435.742, 1324.261 1441.934 C 1334.029 1448.126, 1342.804 1453.390, 1343.761 1453.632 C 1345.058 1453.959, 1347.013 1451.710, 1351.449 1444.785 C 1364.356 1424.643, 1381.952 1396.433, 1394.978 1375 C 1402.500 1362.625, 1411.162 1348.450, 1414.228 1343.500 C 1419.530 1334.939, 1473.761 1244.593, 1480.557 1233 C 1490.768 1215.580, 1494.287 1205.092, 1490.418 1203.607 C 1488.853 1203.006, 1360.139 1203.069, 1350.500 1203.675 M 1055.215 1346.665 C 1050.653 1348.913, 1043.255 1357.423, 1042.030 1361.831 C 1040.669 1366.730, 1040.734 1370.749, 1042.475 1389.563 C 1043.286 1398.328, 1045.997 1428.225, 1048.501 1456 C 1051.004 1483.775, 1055.307 1529, 1058.064 1556.500 C 1060.821 1584, 1063.503 1611, 1064.024 1616.500 C 1064.546 1622, 1065.437 1630.775, 1066.005 1636 C 1066.574 1641.225, 1068.810 1663.968, 1070.976 1686.539 C 1073.142 1709.111, 1075.496 1729.318, 1076.207 1731.444 C 1078.260 1737.581, 1081.505 1739.313, 1091.877 1739.808 C 1107.551 1740.558, 1107.750 1740.392, 1135.195 1703.524 C 1140.527 1696.361, 1146.258 1688.700, 1147.931 1686.500 C 1149.603 1684.300, 1162.888 1666.546, 1177.452 1647.046 C 1192.016 1627.546, 1205.013 1611.025, 1206.333 1610.334 C 1208.859 1609.010, 1213.527 1608.267, 1255.500 1602.501 C 1366.563 1587.245, 1381.956 1584.749, 1386.004 1581.343 C 1392.896 1575.544, 1392.296 1553.021, 1385.096 1547.212 C 1381.743 1544.507, 1356.519 1527.701, 1333 1512.503 C 1319.525 1503.795, 1303.325 1493.283, 1297 1489.142 C 1290.675 1485.002, 1274.250 1474.432, 1260.500 1465.654 C 1227.325 1444.476, 1215.597 1436.967, 1190.011 1420.525 C 1169.685 1407.463, 1141.371 1389.641, 1118 1375.199 C 1112.225 1371.631, 1101.650 1365.068, 1094.500 1360.615 C 1069.867 1345.274, 1062.991 1342.832, 1055.215 1346.665";

// First-paint placeholder for the hole: a plain circle centered on CORE,
// rendered under transform="scale(0)" (invisible) until the intro runs. The
// intro then swaps in a runtime-built dot (one circle PER logo subpath, stacked
// at CORE → a clean round dot) that MorphSVG unfolds into CLIX_PATH.
const DOT_PATH =
  "M 1383.5 1127 C 1383.5 1414.188 1150.688 1647 863.5 1647 C 576.312 1647 343.5 1414.188 343.5 1127 C 343.5 839.812 576.312 607 863.5 607 C 1150.688 607 1383.5 839.812 1383.5 1127 Z";

// Glyph geometry (in path/viewBox units), measured from the path data above.
// BBOX sizes the resting logo; CORE is where the mark's sparkle arms cross —
// the zoom dollies through this solid region so the viewport never lands on
// paper. The half-sizes are conservative insets of the two solid arms.
// ⚠ If the logo artwork is ever swapped, these must be re-measured.
const BBOX = { w: 1286.1, h: 1179.8 };
const CORE = { x: 863.5, y: 1127 };
const ARM_H = { halfW: 330, halfH: 12 }; // horizontal arm (wide, thin)
const ARM_V = { halfW: 17, halfH: 430 }; // vertical arm (thin, tall)

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const holeRef = useRef<SVGPathElement>(null);
  const paperRef = useRef<SVGSVGElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const insideCopyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reliable muted-autoplay (same pattern as before the redesign): set the
  // `muted` DOM property imperatively, retry on `canplay` and on the first
  // user interaction, then self-remove the listeners.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;

    let started = false;
    const events = ["pointerdown", "keydown", "touchstart", "wheel", "scroll"] as const;
    const cleanup = () => {
      v.removeEventListener("canplay", tryPlay);
      events.forEach((e) => window.removeEventListener(e, tryPlay));
    };
    const tryPlay = () => {
      if (started) return;
      v.play().then(
        () => {
          started = true;
          cleanup();
        },
        () => {},
      );
    };

    tryPlay();
    v.addEventListener("canplay", tryPlay);
    events.forEach((e) => window.addEventListener(e, tryPlay, { passive: true }));
    return cleanup;
  }, []);

  useGSAP(
    () => {
      const stage = stageRef.current;
      const hole = holeRef.current;
      const media = mediaRef.current;
      const insideCopy = insideCopyRef.current;
      if (!stage || !hole || !media || !insideCopy) return;

      // k = rendered px per glyph unit. k0 = resting logo size (~50% of the
      // viewport height, width-capped on narrow screens); kEnd = the scale at
      // which one of the two solid sparkle arms fully covers the viewport
      // (whichever arm gets there cheaper — horizontal wins in landscape,
      // vertical in portrait). Recomputed on every ScrollTrigger refresh.
      let k0 = 1;
      let kEnd = 100;
      let cx = 0;
      let cy = 0;
      const measure = () => {
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        cx = w / 2;
        cy = h / 2;
        k0 = Math.min((0.5 * h) / BBOX.h, (0.72 * w) / BBOX.w);
        const kH = Math.max(w / 2 / ARM_H.halfW, h / 2 / ARM_H.halfH);
        const kV = Math.max(w / 2 / ARM_V.halfW, h / 2 / ARM_V.halfH);
        kEnd = Math.min(kH, kV) * 1.06;
      };

      // Place the logo hole at scale k, pinning glyph point CORE to the
      // viewport center — shared by both the intro bloom and the scroll dolly.
      const setHole = (k: number) => {
        hole.setAttribute(
          "transform",
          `translate(${cx} ${cy}) scale(${k}) translate(${-CORE.x} ${-CORE.y})`,
        );
      };

      // Intro: on fresh load the hole is a SOLID ROUND DOT at the viewport
      // center (CORE). It HOLDS for ~2s, then MorphSVG reshapes it into the Clix
      // logo — the dot "forms the shape of the logo" in place. The transform
      // stays pinned at setHole(k0) the whole time, so the morph happens at the
      // resting scale; the scroll dolly then zooms that same logo path from k0.
      // Runs ungated by reduced-motion like the rest of the scroll scene.
      let introDone = false;
      let introTl: gsap.core.Timeline | null = null;

      // ── Loading veil + auto-flight ──
      // While the load sequence plays, the page is PLAIN — just the sheet and
      // the logo hole. <html> carries `.hero-veil`, which hides the navbar
      // (Navbar.tsx opts in with `[.hero-veil_&]` utilities). Once the logo
      // has formed, the page drives the scroll itself through the dolly zoom
      // and lands "inside" the video (the real hero), where the veil lifts.
      // The flight must stay interruptible: cancel listeners are attached
      // from LOAD (not flight start), so the first SCROLL gesture — even
      // during the dot hold, the morph, or the pre-flight beat — kills the
      // pending flight, lifts the veil and hands control back. They run in the
      // CAPTURE phase to beat Lenis's own wheel handler, whose in-flight
      // deltas apply relative to the flight TARGET (i.e. would keep dragging
      // the user down) instead of the current position. Deliberately ungated
      // on reduced-motion: the flight IS the requested load behaviour and the
      // client reviews on a machine that reports reduced motion.
      let flightDead = false; // a user gesture (or teardown) opted out
      let flying = false; // the auto-scroll is actively running
      let flightCall: gsap.core.Tween | null = null; // post-morph beat
      let flightTween: gsap.core.Tween | null = null; // no-Lenis fallback
      let driftTick: (() => void) | null = null; // Lenis-flight watchdog
      const veil = (on: boolean) => {
        document.documentElement.classList.toggle("hero-veil", on);
      };
      const FLIGHT_CANCEL = ["wheel", "touchmove", "keydown"] as const;
      const stopFlight = () => {
        FLIGHT_CANCEL.forEach((e) => window.removeEventListener(e, onCancelInput, true));
        if (driftTick) {
          gsap.ticker.remove(driftTick);
          driftTick = null;
        }
        flightCall?.kill();
        flightCall = null;
        const t = flightTween; // null out BEFORE kill — onInterrupt re-enters
        flightTween = null;
        t?.kill();
        flying = false;
      };
      const cancelFlight = () => {
        flightDead = true;
        const wasFlying = flying;
        stopFlight();
        if (wasFlying) {
          // Lenis path: actually STOP the in-flight animation. A
          // `scrollTo(lenis.scroll, {immediate})` snap is a no-op here —
          // during a programmatic scroll Lenis pins targetScroll to the
          // animated position every frame and scrollTo early-returns on
          // `target === targetScroll`, never reaching the immediate branch.
          // stop()+start() runs Lenis's internal reset(): kills the tween,
          // re-syncs animated/target scroll to the actual position, and
          // leaves the user's own gesture fully in charge. (Only while
          // flying: doing this during the user's OWN smooth scroll would
          // kill their momentum.)
          const lenis = getLenis();
          if (lenis) {
            lenis.stop();
            lenis.start();
          }
        }
        veil(false); // the user is driving — show the site chrome
      };
      // Only genuine scroll / keyboard-navigation intent may cancel. A stray
      // click or a non-scroll key (screenshot hotkey, media key…) must NOT —
      // the flight is the loading screen's only auto-advance, and cancelling
      // on it used to strand the viewer on the paper. Tab counts as intent:
      // this capture-phase handler lifts the veil BEFORE the browser's default
      // Tab handling runs, so focus lands in the (now visible) navbar.
      const SCROLL_KEYS = new Set([
        " ",
        "Spacebar",
        "PageDown",
        "PageUp",
        "ArrowDown",
        "ArrowUp",
        "Home",
        "End",
        "Tab",
      ]);
      const onCancelInput = (e: Event) => {
        if (e.type === "keydown" && !SCROLL_KEYS.has((e as KeyboardEvent).key)) return;
        cancelFlight();
      };
      const releaseFlight = () => {
        stopFlight();
        veil(false);
      };
      const landFlight = () => {
        releaseFlight();
        // Landed inside — make the loading zoom one-way. Deferred a tick to
        // escape the scroll-animation callback stack we're called from.
        sealCall = gsap.delayedCall(0, seal);
      };
      const startFlight = () => {
        // NB: also check `sealed` — a killed ScrollTrigger reports progress 0,
        // so after a seal the progress guard alone would wrongly pass.
        if (flightDead || sealed || st.progress > 0.002) {
          veil(false); // not our page to drive (user scrolled / restored load)
          return;
        }
        flying = true;
        const lenis = getLenis();
        if (lenis) {
          // Lenis has no autoKill: a native scroll the cancel listeners can't
          // see (scrollbar drag, middle-click autoscroll, find-in-page jump)
          // would be stomped back by the flight every frame until it lands,
          // and the drag discarded. Watchdog: a PRIORITIZED ticker callback
          // runs before lenis.raf each tick, so it reads an external write to
          // the real scroll position before Lenis overwrites it — any drift
          // from the animated position means something else is scrolling, and
          // the flight hands over. (Clicks/keys never move scrollY, so this
          // can't re-introduce the stray-gesture stranding this filter fixed.)
          driftTick = () => {
            if (Math.abs(window.scrollY - lenis.scroll) > 8) cancelFlight();
          };
          gsap.ticker.add(driftTick, false, true);
          lenis.scrollTo(st.end, {
            duration: 2.6,
            easing: (t: number) =>
              t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
            onComplete: landFlight,
          });
        } else {
          // No Lenis (reduced-motion machines) → GSAP drives the native
          // scroll; autoKill releases it if anything else moves the page
          // (onInterrupt keeps the listener/veil teardown from being skipped).
          flightTween = gsap.to(window, {
            scrollTo: { y: st.end, autoKill: true },
            duration: 2.6,
            ease: "power2.inOut",
            onComplete: landFlight,
            onInterrupt: releaseFlight, // interrupted ≠ landed — don't seal
          });
        }
      };
      veil(true); // plain sheet from the first paint (layout effect = pre-paint)
      FLIGHT_CANCEL.forEach((e) =>
        window.addEventListener(e, onCancelInput, { capture: true, passive: true }),
      );

      // ── Seal: the loading zoom is one-way ──
      // The first time the viewer is fully "inside" (flight lands, or a manual
      // scroll SETTLES with the zoom complete), the section seals: the paper
      // is dropped, the 300vh scroll runway collapses to a single viewport,
      // the scroll position is shifted by exactly the removed distance (so
      // nothing moves on screen) and all ScrollTriggers refresh against the
      // new layout. From then on the hero is a plain full-screen video band —
      // scrolling back to the top can never re-enter the loading screen.
      let sealed = false;
      let landed = false; // zoom completed once → visual latch (set in apply)
      let sealCall: gsap.core.Tween | null = null; // deferred-seal handle
      const seal = () => {
        if (sealed) return;
        sealed = true;
        landed = true;
        ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
        flightCall?.kill(); // no pending flight may launch against a dead st
        veil(false); // invariant: a sealed hero is never veiled
        const section = sectionRef.current;
        if (!section) return;
        const lenis = getLenis();
        const cur = lenis ? lenis.scroll : window.scrollY;
        st.kill();
        // Pin the end-state visuals statically (paper gone, scene landed).
        if (paperRef.current) paperRef.current.style.display = "none";
        gsap.set(media, { scale: 1.18 });
        gsap.set(insideCopy, { opacity: 1, y: 0 });
        if (ctaRef.current) {
          ctaRef.current.style.pointerEvents = "auto";
          ctaRef.current.inert = false;
        }
        // The navbar's dark-treatment marker now spans the whole band.
        if (markerRef.current) {
          markerRef.current.style.top = "0";
          markerRef.current.style.height = "100%";
        }
        // Collapse, measuring the REAL removed distance — not st.end, which
        // is innerHeight-based and drifts from 100svh by the mobile URL-bar
        // delta — so the compensation is exact on every viewport.
        const before = section.offsetHeight;
        // 100lvh, not 100svh: with the mobile URL bar retracted the viewport
        // is lvh tall, and an svh-tall band would swap the bottom (lvh−svh)
        // strip from this section's own background to the next section's top
        // at the moment of seal. lvh keeps that strip the hero's, so the
        // collapse stays invisible; on desktop lvh === svh. (svh first as a
        // fallback for engines without lvh units.)
        section.style.height = "100svh";
        section.style.height = "100lvh";
        const dy = before - section.offsetHeight;
        // Compensate: content above shrank by dy, so shift scroll by dy too —
        // the viewport shows the exact same pixels before and after.
        const target = Math.max(0, cur - dy);
        if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
        else window.scrollTo(0, target);
        ScrollTrigger.refresh();
      };
      const onScrollEnd = () => {
        // Geometric stage: once the visual latch is down (the stage is
        // frozen at the landed state wherever the scrub sits), collapse the
        // layout at the next scroll SETTLE — never mid-gesture. With the
        // stage frozen, the collapse + exact compensation shows identical
        // pixels from ANY settled position, above or below the hero.
        if (!sealed && landed) seal();
      };
      ScrollTrigger.addEventListener("scrollEnd", onScrollEnd);

      // Hand the hole to the scroll: stop the intro and snap the shape to the
      // full logo so the dolly scales a clean logo (never a half-formed dot).
      const finishIntro = () => {
        introDone = true;
        introTl?.kill();
        cancelFlight(); // the user (or a restored scroll) got here first
        hole.setAttribute("d", CLIX_PATH);
        setHole(k0);
      };

      const zoomEase = gsap.parseEase("power1.inOut");
      const apply = (rawP: number) => {
        // Visual one-way latch: the first time the zoom completes, drop the
        // paper for good and freeze the stage at the landed state — scrolling
        // straight back up (even mid-gesture, before the geometric seal gets
        // a chance to run at the next settle) can never re-show the loading
        // screen.
        if (!landed && rawP >= 0.999) {
          landed = true;
          if (paperRef.current) paperRef.current.style.display = "none";
        }
        const p = landed ? 1 : rawP;
        // The scroll owns the hole once the user moves (or the morph finished).
        if (introDone || p > 0.0001) {
          if (!introDone) finishIntro(); // first scroll wins → snap dot→logo
          // Exponential dolly (constant multiplicative velocity), soft start
          // (logo lingers legibly) + soft arrival "inside". One transform does
          // placement + zoom, pinning CORE to the viewport center at any scale.
          setHole(k0 * Math.pow(kEnd / k0, zoomEase(p)));
        }
        // The scene behind the hole grows slightly as you approach (dolly-in).
        gsap.set(media, { scale: 1.06 + 0.12 * p });
        // Landing copy fades in once the paper has fully cleared the corners.
        // Opacity (NOT autoAlpha): visibility:hidden would drop the page's
        // only h1 from the a11y tree for users who never scrub to the end.
        const ip = gsap.utils.clamp(0, 1, (p - 0.85) / 0.15);
        gsap.set(insideCopy, { opacity: ip, y: 24 * (1 - ip) });
        // The CTAs only become live once the copy is fully revealed. `inert`
        // (not just pointer-events, which is mouse-only) also drops the invisible
        // links from the tab order + a11y tree, so a stray Enter during the
        // loading zoom can't fire their hash-nav either. Scoped to the CTA row so
        // the h1 stays in the a11y tree (its title must survive from first paint).
        if (ctaRef.current) {
          const live = ip >= 1;
          ctaRef.current.style.pointerEvents = live ? "auto" : "none";
          ctaRef.current.inert = !live;
        }
      };

      measure();
      apply(0); // set copy/scene to resting; the dot is placed below

      // Build the intro START SHAPE at runtime: one circle PER logo subpath,
      // all stacked concentric at CORE and each sized to its subpath. Their
      // union is a clean solid dot, and because the subpath COUNT now matches
      // CLIX_PATH (4 ↔ 4), MorphSVG pairs them 1:1 — so the mark UNFOLDS outward
      // from the center instead of one blob dragging to a corner while stray
      // fragments pop in (the old single-circle → 4-subpath morph).
      const NS = "http://www.w3.org/2000/svg";
      const svg = hole.ownerSVGElement!;
      const K = 0.5522847498; // 4-cubic circle constant
      const circleD = (r: number, cw: boolean) => {
        const { x, y } = CORE;
        const c = K * r;
        return cw
          ? `M${x + r} ${y}C${x + r} ${y + c} ${x + c} ${y + r} ${x} ${y + r}C${x - c} ${y + r} ${x - r} ${y + c} ${x - r} ${y}C${x - r} ${y - c} ${x - c} ${y - r} ${x} ${y - r}C${x + c} ${y - r} ${x + r} ${y - c} ${x + r} ${y}Z`
          : `M${x + r} ${y}C${x + r} ${y - c} ${x + c} ${y - r} ${x} ${y - r}C${x - c} ${y - r} ${x - r} ${y - c} ${x - r} ${y}C${x - r} ${y + c} ${x - c} ${y + r} ${x} ${y + r}C${x + c} ${y + r} ${x + r} ${y + c} ${x + r} ${y}Z`;
      };
      // Signed area via sampling (off a throwaway path node) — used to read a
      // shape's winding direction so all circles can share the logo's.
      const signedArea = (d: string) => {
        const p = document.createElementNS(NS, "path");
        p.setAttribute("d", d);
        svg.appendChild(p);
        const len = p.getTotalLength();
        let a = 0;
        let prev = p.getPointAtLength(0);
        for (let i = 1; i <= 64; i++) {
          const pt = p.getPointAtLength((len * i) / 64);
          a += prev.x * pt.y - pt.x * prev.y;
          prev = pt;
        }
        svg.removeChild(p);
        return a;
      };
      // Measure each subpath's radius (bbox) + winding. All circles share ONE
      // winding — that of the largest subpath — so their union renders as a
      // SOLID dot (mixed winding would cancel in the overlaps → a donut).
      let maxR = 1;
      let domR = 0;
      let domSign = 1;
      const radii = (CLIX_PATH.match(/M[^M]*/g) ?? [CLIX_PATH]).map((sub) => {
        const p = document.createElementNS(NS, "path");
        p.setAttribute("d", sub);
        svg.appendChild(p);
        const b = p.getBBox();
        const len = p.getTotalLength();
        let a = 0;
        let prev = p.getPointAtLength(0);
        for (let i = 1; i <= 64; i++) {
          const pt = p.getPointAtLength((len * i) / 64);
          a += prev.x * pt.y - pt.x * prev.y;
          prev = pt;
        }
        svg.removeChild(p);
        const r = 0.5 * Math.max(b.width, b.height);
        maxR = Math.max(maxR, r);
        if (r > domR) {
          domR = r;
          domSign = Math.sign(a) || 1;
        }
        return r;
      });
      const cw = Math.sign(signedArea(circleD(100, true))) === domSign;
      const dotShape = radii.map((r) => circleD(r, cw)).join(" ");

      // Paint the solid dot immediately (union of those circles = a round dot),
      // hold it ~2s, then GROW + UNFOLD it into the logo together. Growth is a
      // CORE-pinned scale (kDot → k0) so it expands straight out of the CENTER;
      // the morph unfolds each circle into its matching subpath.
      const kDot = 13 / maxR; // ~26px solid dot on screen (union radius = maxR)
      const scaleProxy = { k: kDot };
      hole.setAttribute("d", dotShape);
      setHole(kDot);
      introTl = gsap
        .timeline({ delay: 2 }) // hold the dot for ~2s
        .to(
          scaleProxy,
          {
            k: k0,
            duration: 1.6, // slow, deliberate grow-from-center
            ease: "power2.inOut",
            onUpdate: () => {
              if (!introDone) setHole(scaleProxy.k);
            },
          },
          0,
        )
        .to(
          hole,
          {
            duration: 1.6,
            ease: "power2.inOut",
            morphSVG: { shape: CLIX_PATH, shapeIndex: "auto", map: "size" },
            onComplete: () => {
              introDone = true; // landed on the logo; scroll takes over…
              // …but the page takes the first ride itself: a short beat so
              // the mark reads, then the auto-flight through the hole.
              if (!flightDead) flightCall = gsap.delayedCall(0.55, startFlight);
            },
          },
          0,
        );

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => {
          measure();
          if (!introDone) setHole(scaleProxy.k); // keep the dot/forming logo centered on resize
          apply(self.progress);
          // Restored load already past the zoom (refresh mid-page / #hash) →
          // seal straight away so scrolling up never re-enters the loading
          // screen. Deferred a tick to escape the refresh cycle.
          if (!sealed && self.progress >= 0.999) sealCall = gsap.delayedCall(0, seal);
        },
      });
      return () => {
        ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
        sealCall?.kill(); // a stale deferred seal must not fire on a remount
        cancelFlight(); // also halts an in-progress Lenis flight + lifts the veil
        introTl?.kill();
        st.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    // Tall section = scroll room for the zoom; the sticky child holds the
    // scene. bg-bg (white) so overscroll above the sheet stays seamless.
    <section ref={sectionRef} id="top" className="relative h-[300vh] bg-bg">
      {/* Navbar marker — spans the scroll range where the viewer is "inside"
          the dark video (last ~15% of the scrub through the section's end), so
          the navbar flips to its light-on-dark treatment. */}
      <div
        ref={markerRef}
        id="hero-inside"
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[43%]"
      />

      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* ① Scene behind the hole — full-bleed video, dollying in slightly.
            The video is pointer-events-none (sits "in the back") and the media
            layer swallows the context menu, so right-click never surfaces the
            browser's "Save video as…" download option. */}
        <div
          ref={mediaRef}
          onContextMenu={(e) => e.preventDefault()}
          className="absolute inset-0 will-change-transform"
        >
          <video
            ref={videoRef}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            src="/hero-montage.mp4"
            poster="/hero-poster.jpg"
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
          {/* Bottom scrim — keeps the landing copy legible over the footage. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-ink/80 to-transparent sm:h-80"
          />
        </div>

        {/* ② Landing copy — the page title + supporting line. Sits UNDER the
            paper so the opening hole (the mask) is what reveals it; fades in
            over the last 15% and stays as the hero's copy once sealed. */}
        <div ref={insideCopyRef} className="pointer-events-none absolute inset-0 z-10 opacity-0">
          <div className="container-x flex h-full flex-col justify-end pb-16 sm:pb-24">
            {/* Split bottom composition (AI-Finance reference): the display
                headline anchors the bottom START corner (RTL right); the
                supporting line + action cluster anchor the bottom END corner
                (RTL left). Below lg it stacks headline over copy. */}
            <div className="flex flex-col gap-8 sm:gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
              {/* Display headline — forced to two lines (see hero.headlineLines);
                  aria-label carries the full sentence for SR/SEO. */}
              <h1
                aria-label={hero.headline}
                className="max-w-2xl text-hero-statement text-on-ink"
              >
                {hero.headlineLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              {/* Supporting copy + actions — start-aligned (RTL = flush right) so
                  the Hebrew reads naturally right-to-left, not flush-left. Nudged
                  down on lg (translate-y-10 ≈ 40px) so it sits below the
                  taller headline's baseline per user — an intentional stagger. */}
              <div className="max-w-md lg:translate-y-10">
                <p className="text-lead text-on-ink/90">{hero.subcopy}</p>
                <div ref={ctaRef} className="mt-7 flex flex-wrap gap-3">
                  {hero.ctas.map((c) =>
                    c.primary ? (
                      <a
                        key={c.href}
                        href={c.href}
                        className="group inline-flex h-12 items-center gap-2 rounded-xl bg-brand px-7 text-[15px] font-bold text-white shadow-[0_16px_36px_-14px_rgba(46,91,255,0.7)] transition-colors hover:bg-brand-600"
                      >
                        {c.label}
                        <span
                          aria-hidden
                          className="transition-transform duration-200 group-hover:-translate-x-1"
                        >
                          ←
                        </span>
                      </a>
                    ) : (
                      <a
                        key={c.href}
                        href={c.href}
                        className="inline-flex h-12 items-center rounded-xl border border-white/30 bg-white/5 px-7 text-[15px] font-bold text-on-ink backdrop-blur-sm transition-colors hover:bg-white/10"
                      >
                        {c.label}
                      </a>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ③ The paper — a white sheet with the Clix mark cut out of it.
            The hole's zoom is driven by scaling the path inside the mask
            (vector re-render → crisp edge at any scale). Starts at scale(0)
            (no hole) so the first paint is a clean white sheet. */}
        <svg ref={paperRef} aria-hidden className="pointer-events-none absolute inset-0 z-20 h-full w-full">
          <defs>
            <mask id="clix-hero-hole">
              <rect width="100%" height="100%" fill="#fff" />
              <path ref={holeRef} d={DOT_PATH} fill="#000" transform="scale(0)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" className="fill-bg" mask="url(#clix-hero-hole)" />
        </svg>
      </div>
    </section>
  );
}
