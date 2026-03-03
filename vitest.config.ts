import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    css: true,
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
      "**/tests/e2e/**", // Exclude Playwright E2E tests
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "tests/",
        ".next/",
        "*.config.{js,ts}",
        "dist/",
      ],
    },
  },
  resolve: {
    alias: {
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/lib": path.resolve(__dirname, "./lib"),
      "@/types": path.resolve(__dirname, "./types"),
      "@/config": path.resolve(__dirname, "./config"),
      "@/context": path.resolve(__dirname, "./context"),
      "@/app": path.resolve(__dirname, "./app"),
      "@/src": path.resolve(__dirname, "./src"),
      "@": path.resolve(__dirname, "./"),
    },
  },
});
