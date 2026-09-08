"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const articleLinks = [
  { href: "/articles", label: "Alla artiklar" },
  { href: "/authors", label: "Författare" },
];

const defaultCategoryLinks = [
  { href: "/categories/nyheter", label: "Nyheter" },
  { href: "/categories/guider", label: "Guider" },
];

function Chevron({ open }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        clipRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.09 1.04l-4.25 4.5a.75.75 0 0 1-1.09 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
        fillRule="evenodd"
      />
    </svg>
  );
}

function MenuGroup({ label, links, open, onToggle, onClose }) {
  return (
    <div className="relative">
      <button
        aria-expanded={open}
        className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-white"
        onClick={onToggle}
        type="button"
      >
        {label}
        <Chevron open={open} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 min-w-48 rounded-xl border border-white/10 bg-[#10142d]/95 p-2 shadow-xl shadow-black/30 backdrop-blur-xl">
          {links.map((link) => (
            <Link
              className="block rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-white/10 hover:text-white"
              href={link.href}
              key={link.href}
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileGroup({ label, links, onClose }) {
  return (
    <div className="border-t border-white/10 px-4 py-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-dim">{label}</p>
      <div className="grid gap-1">
        {links.map((link) => (
          <Link
            className="rounded-lg px-3 py-2 text-muted transition-colors hover:bg-white/10 hover:text-white"
            href={link.href}
            key={link.href}
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Header({ categoryLinks = defaultCategoryLinks }) {
  const headerRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenus = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        closeMenus();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleMenu = (menuName) => {
    setMobileOpen(false);
    setOpenMenu((currentMenu) => (currentMenu === menuName ? null : menuName));
  };

  return (
    <header
      className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0a0e27]/80 backdrop-blur-xl"
      ref={headerRef}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          aria-label="Nordbladet – startsida"
          className="group flex items-center gap-3"
          href="/"
          onClick={closeMenus}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 via-violet-500 to-purple-500 font-serif text-lg font-bold text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
            N
          </span>
          <span className="font-semibold tracking-tight text-white transition-colors group-hover:text-indigo-200">
            Nordbladet
          </span>
        </Link>

        <nav aria-label="Huvudmeny" className="hidden items-center gap-1 md:flex">
          <Link
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-white"
            href="/"
            onClick={closeMenus}
          >
            Start
          </Link>
          <MenuGroup
            label="Artiklar"
            links={articleLinks}
            onClose={closeMenus}
            onToggle={() => toggleMenu("articles")}
            open={openMenu === "articles"}
          />
          <MenuGroup
            label="Kategorier"
            links={categoryLinks}
            onClose={closeMenus}
            onToggle={() => toggleMenu("categories")}
            open={openMenu === "categories"}
          />
        </nav>

        <div className="relative md:hidden">
          <button
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Stäng meny" : "Öppna meny"}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white"
            onClick={() => {
              setOpenMenu(null);
              setMobileOpen((isOpen) => !isOpen);
            }}
            type="button"
          >
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          {mobileOpen && (
            <div
              className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-white/10 bg-[#10142d]/95 shadow-xl shadow-black/30 backdrop-blur-xl"
              id="mobile-menu"
            >
              <Link className="block px-4 py-3 font-medium text-white hover:bg-white/10" href="/" onClick={closeMenus}>
                Start
              </Link>
              <MobileGroup label="Artiklar" links={articleLinks} onClose={closeMenus} />
              <MobileGroup label="Kategorier" links={categoryLinks} onClose={closeMenus} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
