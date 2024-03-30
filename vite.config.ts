import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve("src", "main.tsx"),
      name: "boids-canvas",
      fileName: (format) => `boids-canvas.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: { globals: { react: "React" } },
    },
  },
  plugins: [react()],
});
