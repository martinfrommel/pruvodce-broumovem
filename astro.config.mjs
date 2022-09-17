import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import prefetch from "@astrojs/prefetch";
import image from "@astrojs/image";
import sitemap from "@astrojs/sitemap";
import alpinejs from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), prefetch(), image(), sitemap(), alpinejs()],
  site: "https://pruvodcebroumovem.cz"
});
