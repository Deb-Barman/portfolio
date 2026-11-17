# Deb Barman — Portfolio

Next.js 16 · React 19 · TypeScript · GSAP ScrollTrigger · Lenis · CSS Modules  
Frontend → **Vercel** (free) · Backend (contact API) → **Render** (free)

```
frontend/   Next.js site (statically pre-rendered, all content in the HTML for SEO)
backend/    Express + TypeScript contact API (validation, CORS lock, rate limit, honeypot)
render.yaml Render blueprint for the backend
```

## The scroll effect — "the page builds itself"
Every block first appears as a **wireframe** (dashed outline, corner handles, a live `width × height`
tag) while **named cursors** (layout, type, motion…) drag it into place; then the real content prints in.
It is scrubbed to your scroll position, so it plays **backwards** when you scroll up.

Around it: Lenis inertia scrolling, hero letters that peel apart, word-by-word text reveal,
count-up stats, a velocity-reactive marquee, a sticky stacking card deck, a timeline whose dot rides the
line, and a **pinned horizontal project gallery** with 3D tilt. On phones the gallery becomes a native
swipe carousel; `prefers-reduced-motion` turns every effect off and shows the content plainly.

Main building block: `frontend/src/components/Assemble.tsx` (wrap anything in it).

## Run locally
```bash
cd backend  && cp .env.example .env && npm install && npm run dev     # http://localhost:10000
cd frontend && cp .env.example .env.local && npm install && npm run dev   # http://localhost:3000
```
Without `RESEND_API_KEY` the backend just logs contact messages (dev only).

## Edit your content
Everything (copy, projects, skills, links) lives in **`frontend/src/data/portfolio.ts`**.
- Each project's `href` currently points to your GitHub profile — swap in each repo URL.
- Add your resume: put `resume.pdf` in `frontend/public/` and set `NEXT_PUBLIC_RESUME_URL=/resume.pdf`.
- Skills count and domain count are computed from the data (your old page said "9 domains"; the data has 7).

## Deploy
### 1. Backend → Render
1. Create a free account at **resend.com** → API Keys → create a key.
2. Push this repo to GitHub. In Render: **New → Blueprint** → select the repo (uses `render.yaml`).
3. Set env vars: `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (the email you used for Resend),
   `ALLOWED_ORIGINS` (your site URL(s), comma-separated, no trailing slash).
4. Note your API URL, e.g. `https://deb-portfolio-api.onrender.com`.

> Render's free plan **blocks SMTP**, so email goes through Resend's HTTP API.  
> Free services sleep after ~15 min idle; the site pings `/health` on load to wake it, and the form
> waits up to ~70 s on a cold start. Optional: an UptimeRobot monitor on `/health` (every 5 min) keeps it awake.

### 2. Frontend → Vercel
1. **Add New → Project** → import the repo → **Root Directory: `frontend`** (Next.js is auto-detected).
2. Environment variables:
   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | your final URL, e.g. `https://debbarman.dev` |
   | `NEXT_PUBLIC_API_URL` | your Render URL (no trailing slash) |
   | `NEXT_PUBLIC_CONTACT_EMAIL` | optional, shows a mail link |
   | `NEXT_PUBLIC_RESUME_URL` | optional, shows the Resume button |
   | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | optional, from Search Console |
3. Deploy. Then add the Vercel/custom-domain URL to `ALLOWED_ORIGINS` on Render.

## SEO: ranking for "Deb Barman"
Built in: server-rendered content, `<h1>Deb Barman</h1>`, title/description, canonical URL,
Open Graph + Twitter cards with a generated share image, `Person` + `WebSite` + `ProfilePage`
JSON-LD with your GitHub/LinkedIn/X as `sameAs`, `sitemap.xml`, `robots.txt`, web manifest, fast static pages.

Nobody can *guarantee* position #1, but these steps are what actually moves it — do them in order:
1. **Custom domain** (e.g. `debbarman.dev` / `debbarman.com`) — the single biggest signal. Set `NEXT_PUBLIC_SITE_URL`.
2. **Google Search Console**: add the site, verify (token in `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` or DNS),
   submit `/sitemap.xml`, then **Request indexing** for the home page.
3. **Link to the site from everything you own** using the name "Deb Barman": LinkedIn (website + About),
   GitHub (profile website + README), X bio, YouTube/other channels, dev.to / Medium / Hugging Face / Kaggle profiles.
4. Keep the same name spelling everywhere; add project write-ups/blog posts that mention your name and link back.
5. Re-check after 2–4 weeks in Search Console → Performance (query: "Deb Barman").
