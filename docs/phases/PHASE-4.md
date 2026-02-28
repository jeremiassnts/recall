# Phase 4 — Calendar

**Status:** 🔲 Not yet implemented

---

## Goal

Calendar view for interviews: monthly and weekly views, click event → job detail, optional “Add to Google Calendar”, timezone-aware (store UTC). Use a mature calendar library as per PLANNING.md.

---

## Planned scope (from PLANNING.md §9.3)

- **Views:** Monthly view, weekly view
- **Interaction:** Click event → open job detail
- **Integration:** Google Calendar add-event button (optional)
- **Data:** Timezone aware; store UTC

---

## Completion criteria (to fill when implemented)

- [ ] Calendar component (monthly and weekly)
- [ ] Events sourced from job applications / interviews
- [ ] Click event opens job detail (or side panel)
- [ ] Dates stored in UTC; display with user timezone if needed
- [ ] Optional: “Add to Google Calendar” for an event
- [ ] Phase 4 doc updated with “Implemented” section and file list

---

## Dependencies

- Phase 1 (Auth + User Sync) — completed.
- Phase 2 (Job CRUD) — required (applications and interviews data).
