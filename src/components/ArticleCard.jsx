import Link from "next/link";
import {
  getAuthorName,
  getCategoryLabel,
  getCategoryRouteSlug,
  getResolvedAuthor,
  getRouteSlug,
} from "@/lib/storyblok";

export default function ArticleCard({ article }) {
  const articleSlug = getRouteSlug(article, "articles");
  const author = getResolvedAuthor(article);
  const authorSlug = getRouteSlug(author, "authors");
  const category = getCategoryLabel(article?.content?.category);
  const categorySlug = getCategoryRouteSlug(article?.content?.category);
  const { title, summary } = article.content || {};

  return (
    <article className="glass-card glass-card-hover flex h-full flex-col p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        {category && categorySlug ? (
          <Link className="glass-pill hover:border-white/30 hover:text-white" href={`/categories/${encodeURIComponent(categorySlug)}`}>
            {category}
          </Link>
        ) : <span />}
        <span className="text-xs text-dim">Artikel</span>
      </div>

      <h2 className="mb-3 text-xl font-semibold leading-snug text-white">
        <Link className="transition-colors hover:text-indigo-200" href={`/articles/${articleSlug}`}>
          {title || "Namnlös artikel"}
        </Link>
      </h2>

      {summary && <p className="line-clamp-3 text-sm leading-relaxed text-muted">{summary}</p>}

      <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-sm">
        {authorSlug ? (
          <Link className="text-muted transition-colors hover:text-white" href={`/authors/${authorSlug}`}>
            Av {getAuthorName(article)}
          </Link>
        ) : <span className="text-muted">Av {getAuthorName(article)}</span>}
        <Link className="shrink-0 font-medium text-indigo-300 transition-colors hover:text-indigo-200" href={`/articles/${articleSlug}`}>
          Läs mer <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
