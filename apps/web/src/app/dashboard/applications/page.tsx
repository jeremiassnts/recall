"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { ApplicationList } from "@/components/ApplicationList";
import type { JobApplication } from "@recall/types";

async function fetchApplications(): Promise<JobApplication[]> {
  const res = await fetch("/api/applications");
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to load applications");
  }
  return res.json();
}

export default function ApplicationsPage() {
  const { data: applications = [], isLoading, error, refetch } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplications,
  });
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const [showForm, setShowForm] = useState(false);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Applications
        </h1>
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
      {!isLoading && !error && (
        <ApplicationList
          applications={applications}
          onEdit={setEditing}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
