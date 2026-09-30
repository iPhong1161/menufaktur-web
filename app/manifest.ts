import type { MetadataRoute } from "next"

// Served at /manifest.webmanifest via the Next.js file-based convention.
// The icons live in /public/brand so they keep stable URLs — app/icon.png is
// content-hashed by Next and is not a reliable href for the manifest.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "menufaktur Kochschule",
    short_name: "menufaktur",
    description:
      "Kochschule in Frankfurt-Bornheim — Kurse buchen und Gutscheine kaufen.",
    start_url: "/",
    display: "standalone",
    theme_color: "#7E1423",
    background_color: "#FFFCE1",
    icons: [
      {
        src: "/brand/menufaktur-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/menufaktur-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      // Android crops home-screen icons to a circle or squircle. These carry
      // 10% padding on every side and an opaque cream background so the mark
      // survives the crop instead of losing its edges.
      {
        src: "/brand/menufaktur-icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/brand/menufaktur-icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
