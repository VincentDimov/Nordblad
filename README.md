# Nordbladet

Nordbladet är en studentbyggd nättidning för kursuppgiften i headless CMS. Den använder Next.js App Router för rutterna och Storyblok som innehållshanteringssystem. Artiklar, författare och kategori-sidor hämtas från Storyblok, medan startsidan är en enkel redaktionell introduktion.

## Teknik

- Next.js 16 med App Router och React Server Components
- JavaScript/JSX
- Tailwind CSS 4
- `@storyblok/react` 7 med RSC-integrationen
- Storybloks Delivery API
- Vercel för deploy, sitemap och robots.txt

## Kom igång

1. Installera beroenden:

   ```bash
   npm install
   ```

2. Kopiera `.env.example` till `.env.local` och fyll i värdena:

   ```env
   STORYBLOK_DELIVERY_API_TOKEN=din_public_delivery_token
   STORYBLOK_REGION=eu
   SITE_URL=http://localhost:3000
   ```

3. Starta utvecklingsservern:

   ```bash
   npm run dev
   ```

Öppna sedan [http://localhost:3000](http://localhost:3000). Utan Delivery API-token visas tomma listor, vilket gör att projektet ändå kan byggas lokalt innan Storyblok-rummet är kopplat.

## Routes

| Route | Funktion |
| --- | --- |
| `/` | Statisk startsida med CTA till artiklar |
| `/articles` | Alla `article`-stories, med resolved author-relation |
| `/articles/[slug]` | Artikel, rich text och länk till författaren |
| `/authors` | Lista med författare |
| `/authors/[slug]` | Författarprofil och artiklar filtrerade på author-reference |
| `/categories/[slug]` | Innehållsdriven kategori-story som renderas av Storyblok |

`src/lib/storyblok.js` är den enda platsen för Delivery API-anrop. Den använder `getStory()` för enskilda stories och `getAll("cdn/stories")` för listor så att paginering inte gör att senare artiklar försvinner.

## Konfigurera Storyblok

Skapa nedanstående content types/components i Storyblok. Använd de tekniska namnen exakt som de skrivs här.

### 1. Content type: `author`

Skapa en content type med fälten:

| Fält | Typ | Inställning |
| --- | --- | --- |
| `name` | Text | Författarens namn |
| `bio` | Textarea | Kort presentation |
| `photo` | Asset | Begränsa till bilder |

### 2. Content type: `article`

| Fält | Typ | Inställning |
| --- | --- | --- |
| `title` | Text | Artikelrubrik |
| `summary` | Textarea | Kort sammanfattning/SEO-beskrivning |
| `content` | Richtext | Artikelns brödtext |
| `category` | Single option | Koppla till datasource `article-categories` |
| `author` | Reference | Begränsa till content type `author` |

När `/articles` och `/articles/[slug]` hämtas skickas `resolve_relations: "article.author"`. Därför kan gränssnittet använda `author.content.name` och skapa korrekt länk från författarstoryns slug: `/authors/[slug]` – aldrig `/authors/authors/[slug]`.

### 3. Datasource: `article-categories`

Skapa datasource **Article Categories** med sluggen `article-categories`. Lägg minst till:

| Namn | Värde |
| --- | --- |
| Nyheter | `nyheter` |
| Guide | `guide` |

Värdet måste motsvara kategori-storyns slug eftersom `filtered-posts` skickar det till Storybloks `filter_query` för `article.category`.

### 4. Content type: `category`

Skapa content type `category` med följande fält:

| Fält | Typ | Inställning |
| --- | --- | --- |
| `title` | Text | Valfri rubrik; storyns namn används som fallback |
| `intro` | Textarea | Valfri introduktion |
| `body` | Blocks | Tillåt blocket `filtered-posts` |

Skapa sedan komponenten/blocket `filtered-posts` (tekniskt namn med bindestreck). Den behöver inga redigerbara fält, men `heading` (Text) kan läggas till om redaktionen vill styra underrubriken.

Koden skickar den aktuella kategori-storyns slug från `Category` till `filtered-posts`. Blocket hämtar sedan bara artiklar med:

```js
filter_query: {
  category: { in: categorySlug }
}
```

Det innebär att en ny datasource-post plus en ny category-story med samma slug och ett `filtered-posts`-block räcker för att skapa en fungerande ny kategorisida. Ingen ny `page.js` behövs.

### Story-mappstruktur och exempeldata

Skapa mapparna och stories enligt följande:

```text
authors/
  anna-andersson       (author)
  samir-ek             (author)
articles/
  en-artikel-slug      (article)
  ytterligare-artikel  (article)
  ...minst fyra totalt, fördelade på båda författarna och kategorierna
categories/
  nyheter              (category, innehåller filtered-posts)
  guide                (category, innehåller filtered-posts)
```

Publicera stories efter att de är klara. Artiklar på en författarsida hämtas med dess Storyblok-UUID:

```js
filter_query: {
  author: { in: authorStory.uuid }
}
```

## SEO

- `src/app/robots.js` genererar `/robots.txt`.
- `src/app/sitemap.js` genererar `/sitemap.xml` och hämtar artiklar, författare och kategori-stories dynamiskt från Storyblok.
- `SITE_URL` används som bas för alla absoluta URL:er. Sätt den till den riktiga produktionsdomänen i Vercel, utan avslutande snedstreck.
- Artikelsidan har `generateMetadata()` med artikelns `title` och `summary` samt `generateStaticParams()` för publicerade artikel-stories. Författare och kategorier har också statiska params.

## Deploy på Vercel

1. Lägg projektet i ett Git-repository och importera det i Vercel.
2. Under **Settings → Environment Variables**, lägg in `STORYBLOK_DELIVERY_API_TOKEN`, `STORYBLOK_REGION` (vanligen `eu`) och `SITE_URL` för Production, Preview och Development efter behov.
3. Deploya. Vercel kör `npm run build` automatiskt.
4. Kontrollera efter deploy att `/robots.txt`, `/sitemap.xml`, artiklar och kategorier fungerar på produktionsdomänen.

### Koppla publicering i Storyblok till ny Vercel-deploy

En Vercel Deploy Hook räcker för att bygga om den statiskt genererade sajten när innehållet publiceras:

1. I Vercel: öppna projektet och gå till **Settings → Git**.
2. Under **Deploy Hooks**, välj ett tydligt namn, exempelvis `storyblok-publish`, och välj den branch som ska deployas (vanligen `main`). Skapa hooken och kopiera URL:en. Behandla URL:en som en hemlighet.
3. I Storyblok: öppna ditt space och gå till **Settings → Webhooks → + New Webhook**.
4. Klistra in Vercel-URL:en i **Endpoint URL**, ge webhooken ett namn och aktivera triggern **Story → published** (`story.published`). Spara.
5. Publicera en testartikel och kontrollera att en ny deployment syns i Vercel.

Välj dessutom `datasource.entries_updated` om en ändring av kategoridatasourcen ska utlösa deploy direkt. Mer information finns i [Vercels dokumentation för Deploy Hooks](https://vercel.com/docs/deploy-hooks) och [Storybloks webhook-dokumentation](https://www.storyblok.com/docs/concepts/webhooks.html).

Det finns även en befintlig valfri endpoint, `/api/revalidate?secret=...`, för on-demand revalidation. Den kräver `STORYBLOK_WEBHOOK_SECRET` och kan användas i stället för eller tillsammans med en Deploy Hook, men behövs inte för uppgiften ovan.

## Kontrollkommandon

```bash
npm run lint
npm run build
```
