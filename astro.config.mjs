import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://ex200-personal-practice.arceprog.dev",
  trailingSlash: "always",
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: { prefixDefaultLocale: false },
  },
  server: { port: 4322, host: "127.0.0.1" },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "es",
        locales: { es: "es-AR", en: "en-US" },
      },
    }),
  ],
});
