import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
     * Next 16 only honours `quality` values listed here; anything else is
     * ignored with a console warning and falls back to the default 75.
     *
     * 75 covers the portfolio grid, where images are small and plentiful. 90 is
     * for the home hero panel — it's the largest image on the site, it's shown
     * beside the headline, and it's a render of the company's own work, so
     * compression artefacts there are the ones people would actually notice.
     */
    qualities: [75, 90],
  },
};

export default nextConfig;
