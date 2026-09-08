import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="glass-card max-w-md p-10 text-center">
        <p className="mb-4 text-7xl font-bold text-gradient">404</p>
        <h1 className="mb-3 text-2xl font-semibold text-white">Sidan kunde inte hittas</h1>
        <p className="mb-8 text-muted">Sidan du letar efter finns inte, eller så har den flyttats.</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="glass-button">Till startsidan</Link>
          <Link href="/articles" className="glass-button hover:bg-white/10">Se artiklar</Link>
        </div>
      </div>
    </main>
  );
}
