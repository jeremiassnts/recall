"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

async function fetchDashboardMetrics() {
  const res = await fetch("/api/dashboard");
  if (!res.ok) throw new Error("Failed to load metrics");
  return res.json();
}

export function DashboardSummary() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardMetrics,
  });

  if (isLoading || !metrics) {
    return (
      <div className="mt-8 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Loading pipeline summary…
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
          Pipeline summary
        </h2>
        <Link
          href="/dashboard/analytics"
          className="text-sm text-accent hover:text-accent-hover dark:text-accent-light font-medium"
        >
          View full analytics →
        </Link>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="text-neutral-600 dark:text-neutral-400">
          <strong className="text-neutral-900 dark:text-white">{metrics.total}</strong> total
        </span>
        <span className="text-neutral-600 dark:text-neutral-400">
          <strong className="text-neutral-900 dark:text-white">{metrics.active}</strong> active
        </span>
        <span className="text-neutral-600 dark:text-neutral-400">
          <strong className="text-neutral-900 dark:text-white">{metrics.offers}</strong> offers
        </span>
        <span className="text-neutral-600 dark:text-neutral-400">
          <strong className="text-neutral-900 dark:text-white">{metrics.conversionRate}%</strong> conversion
        </span>
      </div>
    </div>
  );
}
