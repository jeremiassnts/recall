"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { CalendarView } from "@/components/CalendarView";
import { CalendarEventDetail } from "@/components/CalendarEventDetail";
import { ApplicationForm } from "@/components/ApplicationForm";
import type { JobApplication } from "@recall/types";
import {
  applicationsToCalendarEvents,
  type CalendarEvent,
} from "@/lib/calendarUtils";

async function fetchApplications(): Promise<JobApplication[]> {
  const res = await fetch("/api/applications");
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to load applications");
  }
  return res.json();
}

export default function CalendarPage() {
  const { data: applications = [], isLoading, error, refetch } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplications,
  });

  const events = useMemo(
    () => applicationsToCalendarEvents(applications),
    [applications]
  );

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editing, setEditing] = useState<JobApplication | null>(null);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleEditFromDetail = (app: JobApplication) => {
    setSelectedEvent(null);
    setEditing(app);
  };

  const handleCloseDetail = () => setSelectedEvent(null);
  const handleEditSuccess = () => {
    setEditing(null);
    refetch();
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
        Calendar
      </h1>

      {isLoading && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Loading…
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      )}
      {!isLoading && !error && (
        <CalendarView events={events} onSelectEvent={handleSelectEvent} />
      )}

      {selectedEvent && (
        <CalendarEventDetail
          event={selectedEvent}
          onEdit={handleEditFromDetail}
          onClose={handleCloseDetail}
        />
      )}

      {editing && (
        <ApplicationForm
          application={editing}
          onClose={() => setEditing(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
