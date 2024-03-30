import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve("src", "export.ts"),
      name: "jdls-boids-canvas",
      fileName: (format) => `boids-canvas.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: { globals: { react: "React", "react-dom": "ReactDOM" } },
    },
  },
  plugins: [
    react(),
    dts({
      include: ["src/export.ts"],
    }),
  ],
});
