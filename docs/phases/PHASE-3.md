# Phase 3 — Kanban Board

**Status:** 🔲 Not yet implemented

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

- [ ] Kanban view in web app with columns per stage
- [ ] Drag-and-drop with @dnd-kit; updates persisted via API
- [ ] Order stored and restored (e.g. `order` field or array position)
- [ ] Optimistic updates and basic loading/error handling
- [ ] Responsive layout
- [ ] Phase 3 doc updated with “Implemented” section and file list

---

## Dependencies

- Phase 1 (Auth + User Sync) — completed.
- Phase 2 (Job CRUD) — required (stage, order, list/update APIs).
