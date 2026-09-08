import { getArticles, getAuthors, getCategories, getRouteSlug } from "@/lib/storyblok";

const getSiteUrl = () => (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");

function toSitemapEntry(siteUrl, path, story) {
  return {
    url: `${siteUrl}${path}`,
    lastModified: story?.updated_at || story?.published_at || undefined,
  };
}

export default async function sitemap() {
  const siteUrl = getSiteUrl();
  const [articles, authors, categories] = await Promise.all([
    getArticles(),
    getAuthors(),
    getCategories(),
  ]);

  return [
    toSitemapEntry(siteUrl, "/"),
    toSitemapEntry(siteUrl, "/articles"),
    toSitemapEntry(siteUrl, "/authors"),
    ...articles
      .map((article) => ({ story: article, slug: getRouteSlug(article, "articles") }))
      .filter(({ slug }) => slug)
      .map(({ story, slug }) => toSitemapEntry(siteUrl, `/articles/${slug}`, story)),
    ...authors
      .map((author) => ({ story: author, slug: getRouteSlug(author, "authors") }))
      .filter(({ slug }) => slug)
      .map(({ story, slug }) => toSitemapEntry(siteUrl, `/authors/${slug}`, story)),
    ...categories
      .map((category) => ({ story: category, slug: getRouteSlug(category, "categories") }))
      .filter(({ slug }) => slug)
      .map(({ story, slug }) => toSitemapEntry(siteUrl, `/categories/${slug}`, story)),
  ];
}
