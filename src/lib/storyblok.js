import { apiPlugin, getStoryblokApi, storyblokInit } from "@storyblok/react/rsc";
import { unstable_noStore as noStore } from "next/cache";
import CtaSection from "@/components/blocks/CtaSection";
import Category from "@/components/blocks/Category";
import FeatureGrid from "@/components/blocks/FeatureGrid";
import FeatureItem from "@/components/blocks/FeatureItem";
import FilteredPosts from "@/components/blocks/FilteredPosts";
import Hero from "@/components/blocks/Hero";
import TextSection from "@/components/blocks/TextSection";

const CONTENT_VERSION = process.env.STORYBLOK_VERSION || "published";
const hasStoryblokToken = Boolean(process.env.STORYBLOK_DELIVERY_API_TOKEN);

// The first category story was created with the URL slug `guider`, while
// articles and an earlier version of the navigation used `guide`. Keep the
// legacy URL and category value working while the existing Storyblok content
// is migrated to one shared value.
const categorySlugAliases = {
  guide: "guider",
  guider: "guide",
};

// The old page blocks are kept registered so existing Storyblok page stories
// continue to render while the newspaper content types are added.
const components = {
  hero: Hero,
  feature_item: FeatureItem,
  feature_grid: FeatureGrid,
  text_section: TextSection,
  cta_section: CtaSection,
  category: Category,
  "filtered-posts": FilteredPosts,
  filtered_posts: FilteredPosts,
};

// Do not initialize the API client without a token. This keeps local builds
// usable before a Storyblok space has been connected, while production uses
// the same official RSC integration as soon as its environment variables exist.
if (hasStoryblokToken) {
  storyblokInit({
    accessToken: process.env.STORYBLOK_DELIVERY_API_TOKEN,
    use: [apiPlugin],
    components,
    apiOptions: {
      region: process.env.STORYBLOK_REGION || "eu",
    },
  });
}

function prepareRequest() {
  if (CONTENT_VERSION === "draft") {
    noStore();
  }

  return hasStoryblokToken;
}

function isNotFoundError(error) {
  return error?.status === 404 || error?.response?.status === 404;
}

async function getStories(params) {
  if (!prepareRequest()) return [];

  const storyblokApi = getStoryblokApi();
  return storyblokApi.getAll("cdn/stories", {
    version: CONTENT_VERSION,
    ...params,
  });
}

async function getStory(fullSlug, params = {}) {
  if (!prepareRequest()) return null;

  try {
    const storyblokApi = getStoryblokApi();
    const { data } = await storyblokApi.getStory(fullSlug, {
      version: CONTENT_VERSION,
      ...params,
    });
    return data.story;
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}

const articleParams = {
  starts_with: "articles/",
  content_type: "article",
  resolve_relations: "article.author",
  sort_by: "first_published_at:desc",
};

export async function getArticles() {
  return getStories(articleParams);
}

export async function getArticle(slug) {
  return getStory(`articles/${slug}`, {
    resolve_relations: "article.author",
  });
}

export async function getAuthors() {
  return getStories({
    starts_with: "authors/",
    content_type: "author",
    sort_by: "content.name:asc",
  });
}

export async function getAuthor(slug) {
  return getStory(`authors/${slug}`);
}

export async function getArticlesByAuthor(authorUuid) {
  if (!authorUuid) return [];

  return getStories({
    ...articleParams,
    filter_query: {
      author: {
        in: authorUuid,
      },
    },
  });
}

export async function getArticlesByCategory(categorySlug) {
  if (!categorySlug) return [];

  const categoryValues = [categorySlug, categorySlugAliases[categorySlug]]
    .filter(Boolean)
    .join(",");

  return getStories({
    ...articleParams,
    filter_query: {
      category: {
        in: categoryValues,
      },
    },
  });
}

export async function getCategories() {
  return getStories({
    starts_with: "categories/",
    content_type: "category",
    sort_by: "name:asc",
  });
}

export async function getCategory(slug) {
  const category = await getStory(`categories/${slug}`);

  if (category || !categorySlugAliases[slug]) return category;

  return getStory(`categories/${categorySlugAliases[slug]}`);
}

// These helpers prevent paths such as /authors/authors/anna when Storyblok
// returns full_slug rather than a short slug.
export function getRouteSlug(story, folder) {
  if (!story || typeof story !== "object") return null;

  const fullSlug = story.full_slug?.replace(/^\/+|\/+$/g, "");
  const folderPrefix = `${folder}/`;

  if (fullSlug?.startsWith(folderPrefix)) {
    return fullSlug.slice(folderPrefix.length);
  }

  return story.slug?.replace(/^\/+|\/+$/g, "") || null;
}

export function getResolvedAuthor(article) {
  const author = article?.content?.author;
  const resolvedAuthor = Array.isArray(author) ? author[0] : author;

  return resolvedAuthor && typeof resolvedAuthor === "object"
    ? resolvedAuthor
    : null;
}

export function getAuthorName(article) {
  return getResolvedAuthor(article)?.content?.name || "Okänd författare";
}

export function getCategoryLabel(category) {
  const value = Array.isArray(category) ? category[0] : category;
  if (!value || typeof value !== "string") return null;

  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
}

export function getCategoryRouteSlug(category) {
  const value = Array.isArray(category) ? category[0] : category;
  if (!value || typeof value !== "string") return null;

  const slug = value.replace(/^\/+|\/+$/g, "");
  return categorySlugAliases[slug] || slug;
}

export function getCategoryRouteSlugs(slug) {
  if (!slug || typeof slug !== "string") return [];

  return [...new Set([slug, categorySlugAliases[slug]].filter(Boolean))];
}

export async function getDatasourceMap(slug) {
  if (!prepareRequest()) return new Map();

  const storyblokApi = getStoryblokApi();
  const { data } = await storyblokApi.get("cdn/datasource_entries", {
    datasource: slug,
    version: CONTENT_VERSION,
  });

  return new Map(data.datasource_entries.map((entry) => [entry.value, entry.name]));
}

export async function getDatasourceEntries(slug) {
  if (!prepareRequest()) return [];

  const storyblokApi = getStoryblokApi();
  const { data } = await storyblokApi.get("cdn/datasource_entries", {
    datasource: slug,
    version: CONTENT_VERSION,
  });

  return data.datasource_entries;
}

export async function getPage(slug) {
  return getStory(slug);
}

export async function getPageSlugs() {
  const pages = await getStories({ content_type: "page" });
  return pages.map((story) => story.slug);
}
