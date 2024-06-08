import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const API_URL = `${env.VITE_API_URL ?? ""}`;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/api": API_URL,
      },
    },
    build: {
      outDir: "../_build/frontend",
    },
  };
});
