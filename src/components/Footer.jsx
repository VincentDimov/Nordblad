import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.08]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-dim sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Nordbladet. En PowerTeam studentbyggd nättidning.</p>
        <p>Innehåll hanteras med <Link className="text-indigo-300 hover:text-indigo-200" href="https://www.storyblok.com" rel="noreferrer" target="_blank">Storyblok</Link>.</p>
      </div>
    </footer>
  );
}
