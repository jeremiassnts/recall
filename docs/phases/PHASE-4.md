# Phase 4 — Calendar

**Status:** ✅ Implemented

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

- [x] Calendar component (monthly and weekly)
- [x] Events sourced from job applications / interviews
- [x] Click event opens job detail (or side panel)
- [x] Dates stored in UTC; display with user timezone if needed
- [x] Optional: “Add to Google Calendar” for an event
- [x] Phase 4 doc updated with “Implemented” section and file list

---

## Implemented

- **Library:** `react-big-calendar` with `date-fns` localizer (month + week views).
- **Events:** Built from each application’s `interviews` array and optional `appliedDate` (shown as "Applied: …").
- **Click event:** Opens a detail modal with job summary, localised date/time, "Edit application" (opens existing ApplicationForm), and "Add to Google Calendar" (opens Google Calendar template URL in a new tab with UTC times).
- **Timezone:** Event dates are parsed from ISO strings (UTC); calendar and date-fns display in the user’s local timezone.
- **Nav:** Dashboard layout includes a "Calendar" link to `/dashboard/calendar`.

### Files touched/added

- `apps/web/package.json` — added `date-fns`, `react-big-calendar`, `@types/react-big-calendar`.
- `apps/web/src/lib/calendarUtils.ts` — `applicationsToCalendarEvents`, `getGoogleCalendarUrl`, `CalendarEvent` type.
- `apps/web/src/components/CalendarView.tsx` — calendar UI (month/week, event styling).
- `apps/web/src/components/CalendarEventDetail.tsx` — job detail modal with "Edit" and "Add to Google Calendar".
- `apps/web/src/app/dashboard/calendar/page.tsx` — calendar page (fetch applications, wire events and modals).
- `apps/web/src/app/dashboard/layout.tsx` — added Calendar nav link.

---

## Dependencies

- Phase 1 (Auth + User Sync) — completed.
- Phase 2 (Job CRUD) — required (applications and interviews data).
