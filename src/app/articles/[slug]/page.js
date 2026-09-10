import { notFound } from "next/navigation";
import { StoryblokLiveEditing, StoryblokServerComponent } from "@storyblok/react/rsc";
import {
  getArticle,
  getArticles,
  getResolvedAuthor,
  getRouteSlug,
} from "@/lib/storyblok";

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles
    .map((article) => getRouteSlug(article, "articles"))
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) return { title: "Artikeln kunde inte hittas" };

  return {
    title: article.content?.title,
    description: article.content?.summary,
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  return (
    <>
      <StoryblokLiveEditing story={article} />
      <StoryblokServerComponent
        blok={{
          ...article.content,
          author: getResolvedAuthor(article),
          articleSlug: slug,
        }}
      />
    </>
  );
}
