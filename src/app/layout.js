import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getCategories, getRouteSlug } from "@/lib/storyblok";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Nordbladet",
    template: "%s | Nordbladet",
  },
  description: "Nordbladet är en studentbyggd nättidning med nyheter, guider och perspektiv.",
};

export default async function RootLayout({ children }) {
  const categoryStories = await getCategories();
  const categoryLinks = categoryStories
    .map((category) => {
      const slug = getRouteSlug(category, "categories");

      if (!slug) return null;

      return {
        href: `/categories/${slug}`,
        label: category.content?.title || category.name,
      };
    })
    .filter(Boolean);

  return (
    <html lang="sv" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col overflow-x-hidden">
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute right-[-10rem] top-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 h-[450px] w-[450px] rounded-full bg-violet-600/15 blur-3xl" />
        </div>
        <Header categoryLinks={categoryLinks.length ? categoryLinks : undefined} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
