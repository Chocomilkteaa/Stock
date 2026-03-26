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
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTest.ts",
    globals: true,
  },
});
