import { storyblokEditable } from "@storyblok/react/rsc";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategory, getCategoryLabel } from "@/lib/storyblok";

export default async function FilteredPosts({ blok }) {
  // category_slug is added by the parent Category block from the current
  // category story. No category-specific page component is needed.
  const categorySlug = blok.category_slug || blok.category;
  const articles = await getArticlesByCategory(categorySlug);
  const categoryName = getCategoryLabel(categorySlug) || "den här kategorin";

  return (
    <section {...storyblokEditable(blok)}>
      {blok.heading && <h2 className="mb-6 text-2xl font-semibold text-white">{blok.heading}</h2>}
      {articles.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => <ArticleCard article={article} key={article.uuid} />)}
        </div>
      ) : (
        <div className="glass-card p-8 text-center text-muted">Det finns inga publicerade artiklar i {categoryName} ännu.</div>
      )}
    </section>
  );
}
