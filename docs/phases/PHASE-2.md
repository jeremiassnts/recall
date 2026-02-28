# Phase 2 — Job CRUD

**Status:** 🔲 Not yet implemented

---

## Goal

Implement full create, read, update, delete for job applications. Each application includes the fields defined in PLANNING.md §9.1 and §10 (JobApplication model).

---

## Planned scope (from PLANNING.md)

- **JobApplication fields:** companyName, jobTitle, jobUrl, description, stage, order, status, appliedDate, notes, resumeId, interviews[]
- **API:** REST or equivalent endpoints for CRUD; all scoped by `userId` from JWT
- **Database:** JobApplication model and indexes (userId, stage, appliedDate)
- **Frontend:** Forms and views to add, edit, list, and delete applications (exact UI can be decided in implementation)

---

## Completion criteria (to fill when implemented)

- [ ] JobApplication model in API with Mongoose schema and indexes
- [ ] API routes: list (filtered by user), get one, create, update, delete
- [ ] Web UI: create/edit form, list view, delete flow
- [ ] Validation (e.g. Zod) on API and optionally on frontend
- [ ] Phase 2 doc updated with “Implemented” section and file list

---

## Dependencies

- Phase 1 (Auth + User Sync) — completed.
