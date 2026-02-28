# Phase 3 — Kanban Board

**Status:** ✅ Implemented

---

## Goal

Kanban board for job applications: columns = stages, drag-and-drop between columns, persistent order, optimistic UI, smooth animations, mobile responsive. Use `@dnd-kit/core` as per PLANNING.md.

---

## Planned scope (from PLANNING.md §9.2)

- **Stages (columns):** Wishlist, Applied, Screening, Technical, Final Interview, Offer, Rejected
- **Behavior:** Drag and drop between columns, persistent order (numeric index or array order), optimistic UI, smooth animation, mobile responsive
- **Order:** Numeric indexing or recalculated array order
- **Library:** `@dnd-kit/core`

---

## Completion criteria (to fill when implemented)

- [x] Kanban view in web app with columns per stage
- [x] Drag-and-drop with @dnd-kit; updates persisted via API
- [x] Order stored and restored (e.g. `order` field or array position)
- [x] Optimistic updates and basic loading/error handling
- [x] Responsive layout
- [x] Phase 3 doc updated with “Implemented” section and file list

---

## Dependencies

- Phase 1 (Auth + User Sync) — completed.
- Phase 2 (Job CRUD) — required (stage, order, list/update APIs).

---

## Implemented

- **API:** `PATCH /api/applications/reorder` — body `{ stage, applicationIds }` to set stage and order by index for a column; used when moving cards between columns or reordering within a column.
- **Web:** List/Kanban view toggle on the applications page; Kanban board with columns per stage, sortable cards with `@dnd-kit/core` and `@dnd-kit/sortable`, drag overlay, reorder persisted via reorder API, optimistic cache updates with rollback on error.
- **Responsive:** Applications header and view toggle use `flex-col` / `sm:flex-row`; Kanban columns scroll horizontally on small screens (`overflow-x-auto`).

### Files touched

| Area   | File |
|--------|------|
| API    | `apps/api/src/routes/applications.ts` — reorder endpoint and `JobStage` type |
| Web    | `apps/web/src/app/api/applications/reorder/route.ts` — reorder proxy |
| Web    | `apps/web/src/components/KanbanBoard.tsx` — Kanban UI and drag-and-drop |
| Web    | `apps/web/src/app/dashboard/applications/page.tsx` — view mode state and Kanban/List toggle |
| Web    | `apps/web/package.json` — added `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |
| Docs   | `docs/phases/PHASE-3.md` — status and implemented section |
