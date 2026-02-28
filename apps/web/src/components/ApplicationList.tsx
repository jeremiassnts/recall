"use client";

import type { JobApplication } from "@recall/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function ApplicationList({
  applications,
  onEdit,
  onDeleted,
}: {
  applications: JobApplication[];
  onEdit: (app: JobApplication) => void;
  onDeleted: () => void;
}) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      if (res.status !== 204 && !res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to delete");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      onDeleted();
    },
  });

  const handleDelete = (app: JobApplication) => {
    if (typeof window === "undefined") return;
    if (!window.confirm(`Delete "${app.jobTitle}" at ${app.companyName}?`)) return;
    deleteMutation.mutate(app.id);
  };

  if (applications.length === 0) {
    return (
      <p className="text-neutral-500 dark:text-neutral-400 py-8">
        No applications yet. Add one to get started.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {applications.map((app) => (
        <li
          key={app.id}
          className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 p-4"
        >
          <div className="min-w-0 flex-1">
            <p className="font-medium text-neutral-900 dark:text-white truncate">
              {app.jobTitle}
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
              {app.companyName}
            </p>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center rounded-md bg-accent/10 dark:bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent dark:text-accent-light">
                {app.stage}
              </span>
              {app.appliedDate && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Applied {app.appliedDate}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {app.jobUrl && (
              <a
                href={app.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline"
              >
                Link
              </a>
            )}
            <button
              type="button"
              onClick={() => onEdit(app)}
              className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(app)}
              disabled={deleteMutation.isPending}
              className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
