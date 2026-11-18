import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Deb Barman — AI Developer & Builder",
    short_name: "Deb Barman",
    description: "Portfolio of Deb Barman, AI developer and builder.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b080c",
    theme_color: "#0b080c",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
