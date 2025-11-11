import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      pages: "/src/pages",
      components: "/src/components",
      assets: "/src/assets",
      utils: "/src/utils",
      types: "/src/types",
      context: "/src/context",
      hooks: "/src/hooks",
      api: "/src/api",
    },
  },
});
