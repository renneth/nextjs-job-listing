# Next.js Job Listing

This is a small Next.js job board that reads from a local fixture and renders a listings page plus static job detail pages. It is set up to be easy to run locally without external services.

## Links
Live Demo: `https://nextjs-job-listing-psi.vercel.app`
Live Sitemap: `https://nextjs-job-listing-psi.vercel.app/sitemap.xml`
Rich Text Result: `https://search.google.com/test/rich-results/result/r%2Fjobs?id=bIN-YVEap0sNaPBGZf3QRQ`
Lighthouse Report: `/lighthouse-report.pdf`


## Setup

Install dependencies with `pnpm install`. No environment variables are needed because the current data source is the local `data.json` fixture.

```bash
pnpm install
```

## Run

Start the development server with `pnpm dev` and open `http://localhost:3000`. To check the production build locally, run `pnpm build` and then `pnpm start`.

```bash
pnpm dev
pnpm build
pnpm start
```

## Test

Run the unit tests with `pnpm test`. These tests cover the job filtering and slug lookup helpers that support the routes.

```bash
pnpm test
```

## Replacing The Fixture

To plug in a real external feed, I would replace the `data.json` import in `lib/jobs.ts` with a server-side fetch function that validates and maps the provider response into the existing `Job` shape. Keeping that translation in one place means the page components can stay simple and unchanged. We can use a headless CMS to manage the listing and have the this applicate consume fetch APIs.

## Rendering Strategy

I chose a static-first approach for the job detail pages because the app already knows the slugs ahead of time through `generateStaticParams()`, and the exercise data is read-only. If the real feed changed regularly, I would move this to ISR so pages stay fast while content can refresh without a full rebuild.

## Analytics

The current apply button already pushes a GTM-style event into `window.dataLayer`, so a real GTM container could listen for `job_apply_click` and forward it to GA4 or another analytics destination. If GTM was not being used, I would keep the same event payload and send it through a small analytics helper instead.

## Trade-Offs

I kept the architecture small and direct. The trade-off is that a local fixture and simple filtering do not yet cover real feed failures, stale data, or large datasets.

## Next Steps

If I had more time, I would add feed validation, loading and error monitoring, and stronger route-level tests around metadata and structured data. I would also add a small integration layer for analytics so tracking stays consistent across future UI changes. I would also look into setting up a headless CMS (ie Strapi) and use it as live data.

## Production Readiness Gaps

Before calling this production-ready, it still needs a real feed integration, monitoring, accessibility review, analytics verification, and deployment configuration. It also needs a clear content update strategy, stronger automated tests, and checks for malformed or missing external data.