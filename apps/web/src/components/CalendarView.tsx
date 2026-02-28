"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import type { View } from "react-big-calendar";
import type { CalendarEvent } from "@/lib/calendarUtils";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export function CalendarView({
  events,
  onSelectEvent,
}: {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}) {
  return (
    <div className="h-[600px] rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        resourceAccessor="resource"
        onSelectEvent={(event: CalendarEvent) => onSelectEvent(event)}
        views={["month", "week"] as View[]}
        defaultView="month"
        popup
        className="rbc-calendar-dark dark:[&_.rbc-calendar]:text-neutral-200 [&_.rbc-off-range-bg]:bg-neutral-100 dark:[&_.rbc-off-range-bg]:bg-neutral-800/50 [&_.rbc-today]:bg-accent/5 [&_.rbc-event]:bg-accent [&_.rbc-event]:border-accent [&_.rbc-toolbar_button]:text-neutral-700 dark:[&_.rbc-toolbar_button]:text-neutral-300 [&_.rbc-toolbar_button:active]:bg-accent/20 [&_.rbc-header]:text-neutral-600 dark:[&_.rbc-header]:text-neutral-400"
        eventPropGetter={() => ({
          className: "!bg-accent !border-accent hover:opacity-90",
        })}
      />
    </div>
  );
}
