
# Tamil Brahmin Almanac — Bahrain (Next.js + Tailwind)

Mobile-friendly guide with festival dates, Sankalpam builder, naivedyam, mantras, and a 2025 month-grid calendar.
**No backend required** — Panchāṅga snapshot is locked to `2025‑08‑08 17:18` (Asia/Bahrain).

## Quickstart (local)

```bash
npm i
npm run dev
# open http://localhost:3000
```

## Deploy to Vercel (recommended)

1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com/new → **Import** your repo.
3. Framework: **Next.js** (auto-detected). No env vars required.
4. Click **Deploy**.

## Deploy to Railway

1. Create a new project → **Deploy from GitHub** (select this repo) or **Empty Project** → **Deploy** → **Start Command**: `npm run start`.
2. Railway will build with `npm run build` and start with `npm run start`. Ensure a `PORT` env is set (Railway auto-sets).

## Project structure

```
app/
  layout.tsx
  page.tsx         # the entire app (client component)
src/components/ui/ # small local UI primitives (Button, Card, Tabs, Accordion, ...)
tailwind.config.ts
postcss.config.js
next.config.mjs
```

### Notes
- The **Accordion** here is a simple collapsible; it’s not the full shadcn/radix widget, but looks similar.
- If you later want **live Panchāṅga**, add a serverless route `app/api/panchang/route.ts` and wire a safe upstream.
- To change the default gotra/deity/time, edit `DEFAULT_PANCHANG` and the Sankalpam card defaults in `app/page.tsx`.

Happy festivals! 🎉
