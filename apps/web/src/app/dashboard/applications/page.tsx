"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { ApplicationList } from "@/components/ApplicationList";
import { KanbanBoard } from "@/components/KanbanBoard";
import type { JobApplication } from "@recall/types";

async function fetchApplications(): Promise<JobApplication[]> {
  const res = await fetch("/api/applications");
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to load applications");
  }
  return res.json();
}

type ViewMode = "list" | "kanban";

export default function ApplicationsPage() {
  const { data: applications = [], isLoading, error, refetch } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplications,
  });
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");

  const handleCreated = () => {
    setShowForm(false);
    refetch();
  };

  const handleUpdated = () => {
    setEditing(null);
    refetch();
  };

  const handleDeleted = () => {
    refetch();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Applications
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-700 p-0.5 bg-neutral-100 dark:bg-neutral-800">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === "kanban"
                  ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Kanban
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-colors"
          >
            Add application
          </button>
        </div>
      </div>

      {showForm && (
        <ApplicationForm
          onClose={() => setShowForm(false)}
          onSuccess={handleCreated}
        />
      )}

      {editing && (
        <ApplicationForm
          application={editing}
          onClose={() => setEditing(null)}
          onSuccess={handleUpdated}
        />
      )}

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
      {!isLoading && !error && viewMode === "list" && (
        <ApplicationList
          applications={applications}
          onEdit={setEditing}
          onDeleted={handleDeleted}
        />
      )}
      {!isLoading && !error && viewMode === "kanban" && (
        <KanbanBoard
          applications={applications}
          onEdit={setEditing}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
