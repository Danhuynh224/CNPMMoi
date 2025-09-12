import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"), // entry chính
      name: "ReactCartLibrary", // global name khi dùng UMD
      fileName: (format) => `react-cart-library.${format}.js`,
      formats: ["es", "cjs", "umd"], // xuất đủ 3 dạng
    },
    rollupOptions: {
      external: ["react", "react-dom"], // không bundle react
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
