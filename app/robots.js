export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/auth/", "/api/"],
    },
    sitemap: "https://www.compliantscan.com/sitemap.xml",
    host: "https://www.compliantscan.com",
  };
}
