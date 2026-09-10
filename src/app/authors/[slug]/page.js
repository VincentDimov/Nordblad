import { notFound } from "next/navigation";
import { StoryblokLiveEditing, StoryblokServerComponent } from "@storyblok/react/rsc";
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

  return (
    <>
      <StoryblokLiveEditing story={author} />
      <StoryblokServerComponent
        blok={{
          ...author.content,
          articles,
          authorStory: author,
        }}
      />
    </>
  );
}
