# Vawe Interiors website

Premium marketing site for Vawe Interiors, built with Next.js 16 (App Router, TypeScript) and plain CSS.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Where to edit things

| What | File |
| --- | --- |
| Phone, WhatsApp, email, address, map pin, social links | `src/lib/site.ts` |
| Product collections, variants, copy, images | `src/lib/collections.ts` |
| Home page sections | `src/app/page.tsx` |
| Collection detail pages (`/collections/[slug]`) | `src/app/collections/[slug]/page.tsx` |
| Colours, type, spacing, animations | `src/app/globals.css` (tokens at the top) |
| Logo files | `public/brand/` |
| Photos | `public/images/` (replace a file with the same name to swap it) |

## Motion

- `components/Motion.tsx`: Lenis smooth scroll, reveal-on-scroll (`.reveal`, `.reveal-img`, `Lines`) and parallax (`data-parallax`).
- `components/Hero.tsx`: crossfading slideshow with Ken Burns zoom and progress counter.
- `components/Finishes.tsx`: hover list with a cursor-following material swatch.
- `components/Preloader.tsx`: brand intro, shown once per browser session.

All motion respects `prefers-reduced-motion`.

## Contact form

There is no backend. The form composes the enquiry into a WhatsApp message to the number in `site.ts`.

## Photography

Current photos are royalty-free Unsplash placeholders. Replace them with Vawe's own project photography before launch.
