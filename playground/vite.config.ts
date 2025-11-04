// playground/vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ⚠️ но src в playground у нас нет
      "vue-excel-table": path.resolve(__dirname, "../src"), // локально подключаем либу
    },
  },
  server: {
    port: 5173,
  },
});
