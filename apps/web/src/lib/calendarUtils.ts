import type { JobApplication } from "@recall/types";
import { parseISO, addHours, isValid } from "date-fns";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    type: "interview";
    application: JobApplication;
    interviewId: string;
    interviewTitle?: string;
  };
}

/**
 * Build calendar events from job applications.
 * Interviews use their date (ISO string, stored as UTC); appliedDate is optional "Applied" event.
 * Parsed dates are used as-is; display is in user's local timezone via the calendar.
 */
export function applicationsToCalendarEvents(
  applications: JobApplication[]
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  for (const app of applications) {
    for (const interview of app.interviews ?? []) {
      const start = parseISO(interview.date);
      if (!isValid(start)) continue;
      const end = addHours(start, 1);
      const title =
        interview.title ||
        `${app.jobTitle} @ ${app.companyName}`;
      events.push({
        id: `${app.id}-${interview.id}`,
        title,
        start,
        end,
        resource: {
          type: "interview",
          application: app,
          interviewId: interview.id,
          interviewTitle: interview.title,
        },
      });
    }

    if (app.appliedDate) {
      const start = parseISO(
        app.appliedDate.includes("T") ? app.appliedDate : `${app.appliedDate}T12:00:00.000Z`
      );
      if (isValid(start)) {
        const end = addHours(start, 1);
        events.push({
          id: `${app.id}-applied`,
          title: `Applied: ${app.jobTitle} @ ${app.companyName}`,
          start,
          end,
          resource: {
            type: "interview",
            application: app,
            interviewId: "applied",
            interviewTitle: "Applied",
          },
        });
      }
    }
  }

  return events.sort((a, b) => a.start.getTime() - b.start.getTime());
}

/**
 * Build a Google Calendar "Add event" URL for a calendar event.
 * Uses UTC times in format YYYYMMDDTHHmmssZ.
 */
export function getGoogleCalendarUrl(event: CalendarEvent): string {
  const formatForGoogle = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const startStr = formatForGoogle(event.start);
  const endStr = formatForGoogle(event.end);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${startStr}/${endStr}`,
  });
  if (event.resource.application.notes) {
    params.set("details", event.resource.application.notes);
  }
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
