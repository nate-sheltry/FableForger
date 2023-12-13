import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        editor: resolve(__dirname, "src/editor/index.html"),
        test: resolve(__dirname, "src/test/editor.html"),
      },
    },
  },
});
