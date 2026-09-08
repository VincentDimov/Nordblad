import { notFound } from "next/navigation";
import { StoryblokLiveEditing, StoryblokServerComponent } from "@storyblok/react/rsc";
import {
  getCategories,
  getCategory,
  getCategoryRouteSlugs,
  getRouteSlug,
} from "@/lib/storyblok";

export async function generateStaticParams() {
  const categories = await getCategories();
  const slugs = categories
    .flatMap((category) => getCategoryRouteSlugs(getRouteSlug(category, "categories")));

  return [...new Set(slugs)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  return category
    ? { title: category.content?.title || category.name, description: category.content?.intro }
    : { title: "Kategorin kunde inte hittas" };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) notFound();

  return (
    <>
      <StoryblokLiveEditing story={category} />
      <StoryblokServerComponent
        blok={{
          ...category.content,
          category_slug: getRouteSlug(category, "categories"),
          story_name: category.name,
        }}
      />
    </>
  );
}
