import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
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
