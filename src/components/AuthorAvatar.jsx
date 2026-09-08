import Image from "next/image";

export default function AuthorAvatar({ author, priority = false }) {
  const photo = author?.content?.photo;
  const photoUrl = typeof photo === "string" ? photo : photo?.filename;
  const name = author?.content?.name || "Författare";

  if (!photoUrl) {
    return (
      <div aria-label={`${name} saknar profilbild`} className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl font-semibold text-white">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <Image
        alt={`Porträtt av ${name}`}
        className="object-cover"
        fill
        priority={priority}
        sizes="(max-width: 640px) 128px, 192px"
        src={photoUrl}
      />
    </div>
  );
}
