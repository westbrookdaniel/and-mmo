import { defineConfig } from "vite";

const { PORT = 1234 } = process.env;

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist/app",
  },
});
