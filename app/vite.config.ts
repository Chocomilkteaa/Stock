import { defineConfig } from "vitest/config";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  server: {
    host: "0.0.0.0",
    watch: {
      usePolling: true,
      interval: 1000,
    },
    proxy: {
      "/tpexApi": {
        target: "https://www.tpex.org.tw",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tpexApi/, ""),
      }
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTest.ts",
    globals: true,
  },
});
