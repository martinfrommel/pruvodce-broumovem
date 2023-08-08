import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  experimental: {
    assets: true,
  },
  site: "https://pruvodcebroumovem.cz",
  integrations: [tailwind(), sitemap(), mdx()],
  site: "https://pruvodcebroumovem.cz",
});
