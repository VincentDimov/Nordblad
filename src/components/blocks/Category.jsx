import { StoryblokServerComponent, storyblokEditable } from "@storyblok/react/rsc";

export default function Category({ blok }) {
  const blocks = blok.body || [];
  const title = blok.title || blok.story_name || "Kategori";

  return (
    <main {...storyblokEditable(blok)} className="flex-1 px-6 py-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm uppercase tracking-widest text-dim">Kategori</p>
          <h1 className="mb-4 text-4xl font-semibold text-gradient md:text-5xl">{title}</h1>
          {blok.intro && <p className="text-lg leading-relaxed text-muted">{blok.intro}</p>}
        </div>

        {blocks.map((childBlok) => (
          <StoryblokServerComponent blok={{ ...childBlok, category_slug: blok.category_slug }} key={childBlok._uid} />
        ))}
      </div>
    </main>
  );
}
