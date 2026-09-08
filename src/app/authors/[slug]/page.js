import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import AuthorAvatar from "@/components/AuthorAvatar";
import { getArticlesByAuthor, getAuthor, getAuthors, getRouteSlug } from "@/lib/storyblok";

export async function generateStaticParams() {
  const authors = await getAuthors();
  return authors
    .map((author) => getRouteSlug(author, "authors"))
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const author = await getAuthor(slug);
  return author
    ? { title: author.content?.name, description: author.content?.bio }
    : { title: "Författaren kunde inte hittas" };
}

export default async function AuthorPage({ params }) {
  const { slug } = await params;
  const author = await getAuthor(slug);

  if (!author) notFound();

  const articles = await getArticlesByAuthor(author.uuid);
  const { name, bio } = author.content || {};

  return (
    <main className="flex-1 px-6 py-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        <Link className="mb-8 inline-flex text-sm text-muted transition-colors hover:text-white" href="/authors">
          <span aria-hidden="true" className="mr-2">←</span> Till alla författare
        </Link>
        <section className="glass-card mb-12 grid gap-7 p-7 sm:grid-cols-[12rem_1fr] md:p-10">
          <div className="mx-auto w-36 sm:mx-0 sm:w-full"><AuthorAvatar author={author} priority /></div>
          <div className="self-center">
            <p className="mb-3 text-sm uppercase tracking-widest text-dim">Författare</p>
            <h1 className="mb-4 text-3xl font-semibold text-gradient md:text-4xl">{name || "Namnlös författare"}</h1>
            {bio && <p className="max-w-2xl leading-relaxed text-muted">{bio}</p>}
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-semibold text-white">Artiklar av {name || "författaren"}</h2>
          {articles.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{articles.map((article) => <ArticleCard article={article} key={article.uuid} />)}</div>
          ) : <div className="glass-card p-8 text-muted">Den här författaren har inga publicerade artiklar ännu.</div>}
        </section>
      </div>
    </main>
  );
}
