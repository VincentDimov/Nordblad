import Link from "next/link";
import { StoryblokServerRichText, storyblokEditable } from "@storyblok/react/rsc";
import AuthorAvatar from "@/components/AuthorAvatar";
import { getCategoryLabel, getRouteSlug } from "@/lib/storyblok";

export default function Article({ blok }) {
  const { title, summary, content, category, author } = blok || {};
  const resolvedAuthor = author;
  const authorSlug = getRouteSlug(resolvedAuthor, "authors");
  const authorName = resolvedAuthor?.content?.name || "Okänd författare";
  const categoryLabel = getCategoryLabel(category);

  return (
    <main {...storyblokEditable(blok)} className="flex-1 px-6 py-12 md:py-20">
      <article className="mx-auto max-w-3xl">
        <Link className="mb-8 inline-flex text-sm text-muted transition-colors hover:text-white" href="/articles">
          <span aria-hidden="true" className="mr-2">←</span> Till alla artiklar
        </Link>
        <header className="glass-card mb-8 p-7 md:p-10">
          {categoryLabel && (
            <Link className="glass-pill mb-5 hover:border-white/30 hover:text-white" href={`/categories/${encodeURIComponent(category)}`}>
              {categoryLabel}
            </Link>
          )}
          <h1 className="mb-5 text-3xl font-semibold leading-tight text-gradient md:text-5xl">
            {title || "Namnlös artikel"}
          </h1>
          {summary && <p className="text-lg leading-relaxed text-muted">{summary}</p>}
        </header>

        {content && (
          <div className="glass-card mb-8 p-7 md:p-10">
            <div className="prose-glass">
              <StoryblokServerRichText document={content} />
            </div>
          </div>
        )}

        <aside className="glass-card flex items-center gap-4 p-5">
          <div className="w-16 shrink-0">
            <AuthorAvatar author={resolvedAuthor} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-dim">Skriven av</p>
            {authorSlug ? (
              <Link className="text-lg font-semibold text-white hover:text-indigo-200" href={`/authors/${authorSlug}`}>
                {authorName}
              </Link>
            ) : (
              <p className="text-lg font-semibold text-white">{authorName}</p>
            )}
          </div>
        </aside>
      </article>
    </main>
  );
}
