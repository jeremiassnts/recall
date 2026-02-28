"use client";

import type { JobApplication } from "@recall/types";
import type { CalendarEvent } from "@/lib/calendarUtils";
import { getGoogleCalendarUrl } from "@/lib/calendarUtils";
import { format } from "date-fns";

export function CalendarEventDetail({
  event,
  onEdit,
  onClose,
}: {
  event: CalendarEvent;
  onEdit: (app: JobApplication) => void;
  onClose: () => void;
}) {
  const app = event.resource.application;
  const googleUrl = getGoogleCalendarUrl(event);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-detail-title"
    >
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h2
              id="event-detail-title"
              className="text-lg font-semibold text-neutral-900 dark:text-white"
            >
              {event.title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 p-1 rounded"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
            {format(event.start, "PPp")} – {format(event.end, "p")}
          </p>

          <dl className="space-y-2 mt-4 text-sm">
            <div>
              <dt className="text-neutral-500 dark:text-neutral-400">Company</dt>
              <dd className="font-medium text-neutral-900 dark:text-white">
                {app.companyName}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500 dark:text-neutral-400">Job title</dt>
              <dd className="font-medium text-neutral-900 dark:text-white">
                {app.jobTitle}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500 dark:text-neutral-400">Stage</dt>
              <dd className="font-medium text-neutral-900 dark:text-white">
                {app.stage}
              </dd>
            </div>
            {app.jobUrl && (
              <div>
                <dt className="text-neutral-500 dark:text-neutral-400">Job URL</dt>
                <dd>
                  <a
                    href={app.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Open link
                  </a>
                </dd>
              </div>
            )}
          </dl>

          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => onEdit(app)}
              className="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-colors"
            >
              Edit application
            </button>
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Add to Google Calendar
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-lg border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
