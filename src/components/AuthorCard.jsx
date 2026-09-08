import Link from "next/link";
import AuthorAvatar from "@/components/AuthorAvatar";
import { getRouteSlug } from "@/lib/storyblok";

export default function AuthorCard({ author }) {
  const slug = getRouteSlug(author, "authors");
  const { name, bio } = author.content || {};

  return (
    <article className="glass-card glass-card-hover grid grid-cols-[4.5rem_1fr] gap-4 p-5">
      <AuthorAvatar author={author} />
      <div>
        <h2 className="mb-1 text-lg font-semibold text-white">
          <Link className="hover:text-indigo-200" href={`/authors/${slug}`}>{name || "Namnlös författare"}</Link>
        </h2>
        {bio && <p className="line-clamp-2 text-sm leading-relaxed text-muted">{bio}</p>}
      </div>
    </article>
  );
}
