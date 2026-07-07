import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Split the heavy, rarely-changing vendors into their own chunks so
        // (a) the initial bundle isn't one 1.2MB blob and (b) browsers cache
        // three.js / gsap / motion separately from our app code. three (+
        // @react-three) is by far the biggest — it now loads on its own and,
        // paired with the lazy <HeroScene>, no longer blocks first paint.
        manualChunks: {
          // postprocessing rides with three — both are only reachable through
          // the lazy HeroScene, so together they stay off the critical path
          // (no modulepreload, downloads after first paint).
          // ⚠️ Don't pin @react-three/* here: it's only used by PARKED
          // components, and pinning it force-includes it — dragging React's
          // internals into this chunk, which puts the whole ~800kB chunk back
          // on the eager critical path. (Same reason there's no "react" pin:
          // react resolves through a CJS wrapper, so pinning it splits the
          // wrapper from its internals and re-links the chunks.)
          three: ["three", "postprocessing"],
          gsap: ["gsap", "@gsap/react"],
          motion: ["motion"],
        },
      },
    },
  },
  server: {
    watch: {
      // Don't watch large media sitting in the project (e.g. the hero .mp4). On
      // Windows a video that's open/copying is locked, and chokidar throws an
      // unhandled EBUSY that crashes the whole dev server. We never HMR these.
      // ⚠️ public/ media MUST stay watched: Vite builds its public-file table
      // from this watcher, so an ignored public/*.mp4 gets served as index.html
      // (video elements then fail with a demuxer error in dev).
      ignored: (path: string) =>
        /\.(mp4|mov|webm)$/i.test(path) && !path.replace(/\\/g, "/").includes("/public/"),
    },
  },
});
