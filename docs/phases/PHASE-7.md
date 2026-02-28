# Phase 7 — Hardening + Testing

**Status:** ✅ Implemented (partial)

---

## Goal

Harden security, reliability, and performance; add tests and any missing production readiness. Align with PLANNING.md §11 (Security), §12 (Performance), §13 (Docker), §14 (CI/CD).

---

## Planned scope (from PLANNING.md)

- **Security:** Rate limiting, Helmet (done in Phase 1), CORS strict, Zod validation on backend, Mongo injection prevention, file type validation (resumes)
- **Performance:** Pagination, indexed queries, lazy-loaded columns, code splitting, debounced search, optimistic updates (where applicable)
- **Testing:** Backend Jest, frontend Vitest + React Testing Library, optional E2E (Playwright)
- **Infrastructure:** Docker multi-stage builds (API and web), GitHub Actions (lint, typecheck, test, build, Docker, deploy to Coolify), environments (dev, staging, production)

---

## Completion criteria (to fill when implemented)

- [ ] Rate limiting and CORS locked down
- [ ] Backend tests (Jest) for critical routes and models
- [ ] Frontend tests (Vitest + RTL) for critical components/flows
- [ ] Optional: E2E with Playwright for login and main flows
- [ ] Docker builds for api and web; documented run instructions
- [ ] CI pipeline (install, lint, typecheck, test, build, Docker); deploy to Coolify (or documented)
- [ ] Phase 7 doc updated with “Implemented” section and file list

---

## Implemented

- **Security:** Helmet, CORS, rate limiting (Phase 1). Zod on applications and resumes. Mongo ObjectId for queries. Resume: PDF magic bytes, 5MB limit.
- **Backend tests:** `apps/api/jest.config.js`, `apps/api/src/__tests__/health.test.ts`; app exported when `NODE_ENV=test`; supertest + @types/supertest.
- **Docker:** `apps/api/Dockerfile`, `apps/web/Dockerfile` (multi-stage). Web: Next `output: 'standalone'`.
- **CI:** `.github/workflows/ci.yml` — pnpm install, lint, typecheck, test, build; Docker build for API and web.

### Files added

- `apps/api/jest.config.js` — `apps/api/src/__tests__/health.test.ts` — `apps/api/src/index.ts` (export app; skip start in test) — `apps/api/package.json` (supertest deps) — `apps/api/Dockerfile` — `apps/web/Dockerfile` — `apps/web/next.config.ts` (standalone) — `.github/workflows/ci.yml`

---

## Dependencies

- Phases 1–6 — completed (so all features exist to harden and test).
