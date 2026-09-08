import AuthorCard from "@/components/AuthorCard";
import { getAuthors } from "@/lib/storyblok";

export const metadata = {
  title: "Författare",
  description: "Möt skribenterna bakom Nordbladets artiklar.",
};

export default async function AuthorsPage() {
  const authors = await getAuthors();

  return (
    <main className="flex-1 px-6 py-14 md:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm uppercase tracking-widest text-dim">Redaktionen</p>
          <h1 className="mb-4 text-4xl font-semibold text-gradient md:text-5xl">Våra författare</h1>
          <p className="text-lg leading-relaxed text-muted">Lär känna skribenterna som gör Nordbladet möjligt.</p>
        </div>
        {authors.length ? (
          <div className="grid gap-5 sm:grid-cols-2">{authors.map((author) => <AuthorCard author={author} key={author.uuid} />)}</div>
        ) : <div className="glass-card p-8 text-muted">Det finns inga publicerade författare ännu.</div>}
      </div>
    </main>
  );
}
