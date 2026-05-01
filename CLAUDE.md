# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # local dev server
npm run build        # Next.js production build
npm run lint         # ESLint
npm run pages:build  # Cloudflare Pages build (via @cloudflare/next-on-pages)
npm run deploy       # pages:build + wrangler pages deploy
```

> `.npmrc` sets `legacy-peer-deps=true` — required because `@cloudflare/next-on-pages` has a peer dep ceiling of Next 15 but the project runs Next 16.

## Architecture

Single-page app (`src/app/page.tsx`) with no routing. The layout is a fixed flex column:

1. **TopBar** (fixed, 56 px) — branding, animated calorie total, hover-to-set daily goal, tap-logo-to-clear-all.
2. **Upper half** (`flex: 1`) — duck logo + hint text, always visible.
3. **FoodInput** (anchored center) — textarea with predictive dropdown sourced from the local food DB.
4. **Lower half** (`flex: 1, overflowY: auto`) — reverse-chronological feed of entries.

### Data flow

```
User types → FoodInput → onSubmit(text, calories?)
  → if calories known (dropdown hit or manual pattern): instant done entry, no API
  → else: optimistic pending entry → POST /api/estimate → update to done/error
```

State lives in `useEntries` (src/hooks/useEntries.ts), which hydrates from localStorage after mount to avoid SSR mismatch. Every mutation (`addEntry`, `removeEntry`, `updateEntry`, `clearEntries`) writes through to `src/lib/storage.ts` immediately.

### Entry status lifecycle

`pending` → `done` | `error`

Only `done` entries count toward the calorie total. If the newest entry is `error` when a new submission arrives, it is replaced rather than stacked.

### Food database (`src/lib/foods.ts`)

Generated from `ms_annual_data_2022.xls` (24,456 items, 92 chains). Do not hand-edit — regenerate with the `xlsx` package script if the source file changes. Exports:
- `getSuggestions(query, max?)` — returns `FoodItem[]` for the dropdown
- `lookupCalories(name)` — O(1) map lookup by lowercase name

### API route (`src/app/api/estimate/route.ts`)

- `export const runtime = 'edge'` — required for Cloudflare Workers compatibility
- Model: `gemini-2.5-flash` (other Gemini models hit quota on the free tier)
- Requires `GEMINI_API_KEY` in `.env.local`
- Always recalculates `total_calories` from items as a defensive check

### Tailwind

Uses **Tailwind v4** CSS-based config — there is no `tailwind.config.ts`. Custom design tokens are defined in `src/app/globals.css` under `@theme`. Use those CSS variables for all colors (surface, accent `#22c55e`, text, muted, border).

### iPhone Safari constraints

- All font sizes ≥ 16 px (prevents iOS auto-zoom on input focus)
- Layout uses `100dvh`, not `100vh`
- `viewport-fit=cover` + `env(safe-area-inset-*)` for notch/home-bar clearance
- `overscroll-behavior: none` to prevent pull-to-refresh

### localStorage keys

| Key | Purpose |
|---|---|
| `openkal_entries` | Feed entries (JSON array, capped at 200) |
| `openkal_v` | Schema version (`"1"`) — mismatch clears entries |
| `openkal_goal` | Daily calorie goal (integer string) |
