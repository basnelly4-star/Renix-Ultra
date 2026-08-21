import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: (() => {
    const base = [react()];
    if (mode === "development") {
      try {
        // require dynamically to avoid loading native bindings in production builds
        // (some environments may have @swc/core native binding issues)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { componentTagger } = require("lovable-tagger");
        base.push(componentTagger());
      } catch (e) {
        // failed to load tagger — ignore in CI/production
        // console.warn("lovable-tagger not available:", e);
      }
    }
    return base;
  })(),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Extract vendor libraries for better caching
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-select",
            "@radix-ui/react-tooltip",
            "recharts",
          ],
          "vendor-forms": ["react-hook-form", "zod", "@hookform/resolvers"],
          "vendor-utils": ["@tanstack/react-query", "date-fns", "embla-carousel-react"],
          // Critical pages stay in main bundle or get small chunks
          // Secondary pages are lazy-loaded separately
        },
      },
    },
    // Optimize chunk size thresholds
    chunkSizeWarningLimit: 1000, // Warn if chunk > 1MB
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
}));
