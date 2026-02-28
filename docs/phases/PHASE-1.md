# Phase 1 — Auth + User Sync

**Status:** ✅ Completed

---

## Summary

Phase 1 delivers the entry experience and authentication foundation: login-first split-screen UI, Auth0 (Google), JWT validation in the API, and user sync to MongoDB. No landing page; `/` is the login screen.

---

## Implemented

### Monorepo (Turborepo)

- **Root:** `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.gitignore`
- **Apps:** `apps/web` (Next.js), `apps/api` (Express)
- **Packages:** `packages/types`, `packages/config`, `packages/ui`
- **Scripts:** `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`

### Frontend (apps/web)

- **Framework:** Next.js 15, App Router, TypeScript, Tailwind CSS
- **Entry route:** `/` is the login page (no marketing landing page)
- **Split-screen layout:**
  - **Left (auth panel):** Recall wordmark, “Track your job applications with clarity.”, “Login with Google” button, dark/light mode toggle (top-right)
  - **Right (info panel):** App name, short bullet list (pipeline, calendar, resume, analytics), subtle dark blue accent gradients
- **Auth:** `@auth0/nextjs-auth0` — Login with Google, route handlers at `/api/auth/[auth0]` (login, logout, callback)
- **Theme:** `next-themes` — `class="dark"`, persisted in `localStorage` (`recall-theme`), system preference supported
- **Design:** Neutral base, dark blue accent (`#1e3a5f`) for primary button and info-panel bullets only
- **Protected route:** `/dashboard` — middleware protects it; unauthenticated users are sent to Auth0 login
- **Dashboard:** Welcome message, logout link, client-side call to sync user with backend (with error message if sync fails)
- **Sync flow:** Client calls Next.js `POST /api/sync-user`; that route uses `getAccessToken()` and calls Express `POST /api/users/sync` with `Authorization: Bearer <token>`

### Backend (apps/api)

- **Stack:** Express, TypeScript, Mongoose, `express-jwt` + `jwks-rsa`, Helmet, CORS
- **Health:** `GET /health` returns `{ status: "ok" }`
- **Auth middleware:** JWT validation via Auth0 JWKS; `AUTH0_ISSUER_BASE_URL` and optional `AUTH0_AUDIENCE`
- **User model (MongoDB):** `auth0Id` (unique), `name`, `email`, timestamps; index on `auth0Id`
- **User routes (protected by JWT):**
  - `POST /api/users/sync` — upsert user by `auth0Id` (from JWT `sub`), set `name`/`email`; returns user payload
  - `GET /api/users/me` — return current user by JWT `sub`
- **Config:** `MONGODB_URI`, `WEB_ORIGIN`, `AUTH0_ISSUER_BASE_URL`, `AUTH0_AUDIENCE` (optional)

### Shared

- **@recall/types:** `User`, `UserCreate` interfaces
- **@recall/config:** `tsconfig.base.json`, `eslint.config.js` (optional use)
- **@recall/ui:** Placeholder package for future shared UI

### Environment

- **apps/web:** `.env.example` — Auth0 vars, `API_URL`, optional `AUTH0_AUDIENCE`
- **apps/api:** `.env.example` — `PORT`, `MONGODB_URI`, Auth0, `WEB_ORIGIN`

---

## Files Added / Touched

| Area        | Path |
|------------|------|
| Root       | `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.gitignore` |
| packages   | `packages/types/*`, `packages/config/*`, `packages/ui/*` |
| apps/web   | `src/app/layout.tsx`, `page.tsx`, `globals.css`, `src/app/dashboard/page.tsx`, `src/app/api/auth/[auth0]/route.ts`, `src/app/api/sync-user/route.ts`, `src/components/LoginPanel.tsx`, `InfoPanel.tsx`, `ThemeToggle.tsx`, `ThemeProvider.tsx`, `LogoutButton.tsx`, `SyncUser.tsx`, `src/middleware.ts`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `.env.example` |
| apps/api   | `src/index.ts`, `src/db.ts`, `src/middleware/auth.ts`, `src/models/User.ts`, `src/routes/users.ts`, `src/types/express.d.ts`, `tsconfig.json`, `.env.example` |

---

## How to Run

1. **Auth0:** Create tenant, application (SPA or Regular Web), enable Google connection. Create an API (optional) and set its identifier as `AUTH0_AUDIENCE` in both web and api for user-sync.
2. **MongoDB:** Local or Atlas; set `MONGODB_URI` in `apps/api`.
3. **Env:** Copy `.env.example` to `.env` in `apps/web` and `apps/api`; fill Auth0 and MongoDB.
4. **Install & run:** From repo root: `pnpm install`, `pnpm dev` (runs web and api in parallel).

---

## Out of Scope for Phase 1

- Job CRUD, Kanban, calendar, resumes, dashboard analytics
- Rate limiting, optional Auth0 API (audience) for sync — recommended but not required to see login/dashboard
