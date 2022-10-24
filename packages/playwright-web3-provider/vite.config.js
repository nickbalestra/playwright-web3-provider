import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["umd"],
      name: "pwp",
      fileName: "window-ethereum",
    },
  },
});
