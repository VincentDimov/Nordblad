import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 items-center px-6 py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-indigo-300">Nättidning för nyfikna</p>
          <h1 className="mb-6 max-w-3xl text-5xl font-semibold leading-[1.05] text-gradient sm:text-6xl">Perspektiv som gör vardagen större.</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted md:text-xl">Nordbladet samlar nyheter och pedagogiska guider från våra skribenter – för dig som vill förstå mer av det som händer omkring dig.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link className="glass-button bg-white/10 hover:bg-white/15" href="/articles">Utforska artiklar <span aria-hidden="true">→</span></Link>
            <Link className="glass-button" href="/categories/nyheter">Senaste nyheterna</Link>
          </div>
        </div>
        <aside className="glass-card p-7 md:p-9">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-dim">På Nordbladet</p>
          <div className="space-y-6">
            <div><p className="mb-1 text-lg font-semibold text-white">Nyheter</p><p className="leading-relaxed text-muted">Aktuella berättelser med sammanhang och flera perspektiv.</p></div>
            <div className="border-t border-white/10 pt-6"><p className="mb-1 text-lg font-semibold text-white">Guider</p><p className="leading-relaxed text-muted">Praktisk kunskap som gör svåra ämnen lite enklare att ta till sig.</p></div>
          </div>
        </aside>
      </div>
    </main>
  );
}
