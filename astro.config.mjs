import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import prefetch from "@astrojs/prefetch";
import image from "@astrojs/image";
import sitemap from "@astrojs/sitemap";
import turbolinks from "@astrojs/turbolinks";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: 'https://pruvodcebroumovem.cz',
  integrations: [tailwind(), prefetch({
    throttle: 3
  }), image(), sitemap(), turbolinks(), mdx()],
  site: "https://pruvodcebroumovem.cz"
});