# Phase 2 — Job CRUD

**Status:** ✅ Completed

---

## Summary

Phase 2 adds full create, read, update, and delete for job applications. The API exposes REST endpoints scoped by the authenticated user; the web app provides a list view, add/edit form (modal), and delete with confirmation.

---

## Implemented

### Shared types (@recall/types)

- **JOB_STAGES** constant: Wishlist, Applied, Screening, Technical, Final Interview, Offer, Rejected
- **JobStage** type
- **Interview** interface: id, date, title?, notes?
- **JobApplication** interface: id, userId, companyName, jobTitle, jobUrl?, description?, stage, order, status?, appliedDate?, notes?, resumeId?, interviews[], createdAt?, updatedAt?
- **JobApplicationCreate** and **JobApplicationUpdate** interfaces

### Backend (apps/api)

- **JobApplication model (Mongoose):** userId (ObjectId ref User), companyName, jobTitle, jobUrl, description, stage (enum), order, status, appliedDate, notes, resumeId, interviews[] (subdoc: id, date, title?, notes?). Indexes: userId; userId + stage; userId + appliedDate (desc).
- **getCurrentUserId helper:** Resolves JWT `sub` (Auth0 id) to MongoDB User `_id`; returns 401/404 with JSON as needed.
- **Applications routes (all under auth middleware):**
  - **GET /api/applications** — List current user’s applications. Query: `stage` (optional). Sorted by order, appliedDate, createdAt.
  - **GET /api/applications/:id** — Get one; 404 if not found or not owned.
  - **POST /api/applications** — Create; body validated with Zod (companyName, jobTitle, jobUrl?, description?, stage, status?, appliedDate?, notes?). `order` set to max+1.
  - **PATCH /api/applications/:id** — Update; partial body validated with Zod; 404 if not found or not owned.
  - **DELETE /api/applications/:id** — Delete; 204 on success; 404 if not found or not owned.
- **Zod validation:** createBodySchema and updateBodySchema; 400 with flattened errors on failure.
- **Dependency:** zod added to API.

### Next.js API proxy (apps/web)

- **lib/api.ts:** `fetchApi(path, options)` — gets Auth0 access token and forwards request to Express with `Authorization: Bearer`.
- **GET /api/applications** — Proxies to Express; supports `?stage=`.
- **POST /api/applications** — Proxies body to Express.
- **GET /api/applications/[id]** — Proxies to Express.
- **PATCH /api/applications/[id]** — Proxies body to Express.
- **DELETE /api/applications/[id]** — Proxies to Express.

### Frontend (apps/web)

- **QueryProvider:** Wraps app with TanStack Query (QueryClientProvider); used in root layout.
- **Dashboard layout:** Shared header with Recall link, “Applications” nav link, SyncUser, Logout. Used for /dashboard and /dashboard/applications.
- **Dashboard home (/dashboard):** Short welcome and “View applications” link.
- **Applications page (/dashboard/applications):**
  - useQuery for list (queryKey `["applications"]`).
  - “Add application” button opens modal form.
  - **ApplicationList:** Renders cards (job title, company, stage badge, applied date, link to job URL, Edit, Delete). Delete uses `window.confirm` then useMutation; invalidates list on success.
  - **ApplicationForm (modal):** react-hook-form + zodResolver + same Zod shape as API (companyName, jobTitle, jobUrl, description, stage, appliedDate, notes). Create (POST) and edit (PATCH) mutations; on success closes modal and invalidates list. Styling: overlay + card, dark blue primary button, neutral cancel.
- **Dependencies:** @tanstack/react-query, react-hook-form, @hookform/resolvers, zod.

---

## Files added / changed

| Area        | Path |
|------------|------|
| packages/types | src/index.ts (JobApplication, JOB_STAGES, Interview, Create/Update types) |
| apps/api   | package.json (zod), src/index.ts (applications router), src/helpers/getCurrentUserId.ts, src/models/JobApplication.ts, src/routes/applications.ts |
| apps/web   | package.json (TanStack Query, RHF, zod, @hookform/resolvers), src/app/layout.tsx (QueryProvider), src/app/dashboard/layout.tsx (new), src/app/dashboard/page.tsx (simplified), src/app/dashboard/applications/page.tsx (new), src/app/api/applications/route.ts (new), src/app/api/applications/[id]/route.ts (new), src/lib/api.ts (new), src/components/QueryProvider.tsx (new), src/components/ApplicationForm.tsx (new), src/components/ApplicationList.tsx (new) |

---

## Completion criteria

- [x] JobApplication model in API with Mongoose schema and indexes
- [x] API routes: list (filtered by user, optional stage), get one, create, update, delete
- [x] Web UI: create/edit form (modal), list view, delete flow (confirm then mutate)
- [x] Validation (Zod) on API; react-hook-form + Zod on frontend form
- [x] Phase 2 doc updated with “Implemented” section and file list

---

## Dependencies

- Phase 1 (Auth + User Sync) — completed.
