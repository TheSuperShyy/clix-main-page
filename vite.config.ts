import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // Don't watch large media sitting in the project (e.g. clix-ads.mp4). On
      // Windows a video that's open/copying is locked, and chokidar throws an
      // unhandled EBUSY that crashes the whole dev server. We never HMR these.
      ignored: ["**/*.mp4", "**/*.mov", "**/*.webm"],
    },
  },
});
