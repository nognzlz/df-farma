import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Local nest app
        changeOrigin: true,
      },
      "/socket.io": {
        target: "http://localhost:3000", // Local socket.io app
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
