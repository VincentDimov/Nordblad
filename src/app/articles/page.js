import ArticleCard from "@/components/ArticleCard";
import { getArticles } from "@/lib/storyblok";

export const metadata = {
  title: "Artiklar",
  description: "Läs alla artiklar från Nordbladets skribenter.",
};

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="flex-1 px-6 py-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm uppercase tracking-widest text-dim">Nordbladet</p>
          <h1 className="mb-4 text-4xl font-semibold text-gradient md:text-5xl">Alla artiklar</h1>
          <p className="text-lg leading-relaxed text-muted">Nyheter och guider skrivna av våra författare.</p>
        </div>
        {articles.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => <ArticleCard article={article} key={article.uuid} />)}
          </div>
        ) : (
          <div className="glass-card max-w-2xl p-8 text-muted">
            Det finns inga publicerade artiklar ännu. Kontrollera att Storyblok är konfigurerat och att artiklarna ligger i mappen <code>articles/</code>.
          </div>
        )}
      </div>
    </main>
  );
}
