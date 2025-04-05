import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "1a4a6ef1-1e65-4510-816f-1e6aef3aa281-00-3nrwy3t3k9mhn.spock.replit.dev",
    ],
  },
});
