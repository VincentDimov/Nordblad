const getSiteUrl = () => (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export default function robots() {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
