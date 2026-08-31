# Fare Finder

Build a Saas landing page + authenticated app shell for Flight Price Notifier(機票降價通知), a product that watches popular flight routes from Taipei and emails the user when the cheapest fare drops to or below their target price - targeted at budget-driven travelers who don't care exactly when they fly, they just want a ticket under their budget.

The site must include:

A public landing page(/)with:

Hero section:product name"Flight Price Notifier" prominetly displayed, value prop 「設定航線與目標價，機票降價就通知你」(English subtitle:"Set a route and a target price --we email you when the fare drops."), and a primary CTA button labeled "Sign in/登入" in the top-right header.

Features section with exactly 3 feature cards:

Card 1: 「盯緊熱門航線(Always-on route watching)」,-- 持續監控台北出發的熱門航線 (東京、首爾)，自動抓最低票價

Card 2:「達標自動通知(Target-price email alerts)」-- 低於你設定的目標價，就寄email提醒你，附上立即訂購連結。

Card 3:「隨時取消(Cancel anytime)」 -- 月訂閱制，不想用隨時停，沒有綁約

Footer with copyright「© 2026 Flight Price Notifier」

Authentication backed by the project's own Supabase project (`flight-price-notifier-001`, ref `yjjmfaulcniwqfhnweiy`). Lovable Cloud is no longer used as the backend:

Sign up page with email + password

Sing in page with email + password

Sign Out functionality

Email confirmation can be disabled for simplicity in this v1

An authenticated app shell at /app that the user lands on after signing in:

Greets the signed-in user by emails:「Hi {user.email}」 

A placeholder message:「你的航線追蹤儀表板即將上線--下一個里程碑會加上訂閱航線的功能。」(English:"Your dashboard is coming soon. Route-subscription will be added in the next milestone.") 

A Sign Out button in the header

Design requirements:

Modern,professional dark theme(purple/violet accent on a near-black background)

Use inter or a similar sans-serif font

Mobile responsive

Tasteful subtle animations(fade-in on scroll is fine; don't overdo it)

Out of scope for this v1:route-subscription form, target-price input, fare display, payment,custom database tables(do NOT create a subscriptions or profiles table -- only use Supabase's default auth-users). Those come in later milestones. Stick to landing page + auth + placeholder dashboard.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/83acef14-5ec6-4d72-918a-22c29b0ac9c0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Stack

Plain **Vite + React SPA** — no SSR, no server runtime.

- React 19 + TypeScript, bundled by Vite
- **React Router** (`createBrowserRouter`) for client-side routing
- Tailwind CSS v4 + shadcn/ui (Radix) components
- Supabase JS for auth (browser-side only)
- TanStack Query for data fetching

### Routes

| Path | Page |
| --- | --- |
| `/` | Landing page |
| `/sign-in` | Sign in (email + password) |
| `/sign-up` | Sign up (email + password) |
| `/auth` | Redirects to `/sign-in` (legacy link) |
| `/app` | Dashboard — guarded, redirects to `/sign-in` when signed out |
| anything else | 404 |

## Development

You need Node.js 20.19+ (or 22.12+). Any of npm / pnpm / bun works.

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev       # http://localhost:8080
```

Other scripts: `npm run typecheck`, `npm run lint`, `npm run build`, `npm run preview`.

### Environment variables

See `.env` (committed) and `.env.example`:

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project API URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser-safe, RLS-gated key (`sb_publishable_*`); replaces the older "anon key" |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ref, for reference/tooling |

Vite inlines these at build time, so they must also be set in the Vercel project.
The Supabase client (`src/integrations/supabase/client.ts`) is the single place the
client is created and reads these vars only — no hardcoded URLs or keys anywhere.

## Deploying to Vercel

`npm run build` emits a fully static bundle to `dist/`. `vercel.json` sets the
framework preset, the output directory, and a catch-all rewrite to
`/index.html`, so deep links such as `/app` are resolved by the client router
instead of 404-ing.

| Setting | Value |
| --- | --- |
| Build command | `vite build` |
| Output directory | `dist` |
| Install command | default |
