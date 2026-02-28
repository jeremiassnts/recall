"use client";

import { useQuery } from "@tanstack/react-query";
import type { DashboardMetrics } from "@recall/types";

async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const res = await fetch("/api/dashboard");
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to load dashboard metrics");
  }
  return res.json();
}

function MetricCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: number | string;
  subtext?: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900/50 p-4">
      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-white">
        {value}
      </p>
      {subtext != null && (
        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          {subtext}
        </p>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardMetrics,
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
          Analytics
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Loading metrics…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
          Analytics
        </h1>
        <p className="text-sm text-red-600 dark:text-red-400">
          {error instanceof Error ? error.message : "Failed to load metrics"}
        </p>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
        Analytics
      </h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
        Pipeline metrics and conversion overview.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total applications" value={metrics.total} />
        <MetricCard
          label="Active"
          value={metrics.active}
          subtext="Not rejected"
        />
        <MetricCard label="Rejected" value={metrics.rejected} />
        <MetricCard label="Offers" value={metrics.offers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Conversion rate
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Offers ÷ total applications
            </p>
          </div>
          <div className="p-4">
            <p className="text-3xl font-semibold text-accent dark:text-accent-light">
              {metrics.conversionRate}%
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Applications per stage
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left py-3 px-4 font-medium text-neutral-600 dark:text-neutral-400">
                    Stage
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-neutral-600 dark:text-neutral-400">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {metrics.byStage.map(({ stage, count }) => (
                  <tr
                    key={stage}
                    className="border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                  >
                    <td className="py-3 px-4 text-neutral-900 dark:text-white">
                      {stage}
                    </td>
                    <td className="py-3 px-4 text-right text-neutral-600 dark:text-neutral-400">
                      {count}
                    </td>
                  </tr>
                ))}
                {metrics.byStage.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="py-6 px-4 text-center text-neutral-500 dark:text-neutral-400"
                    >
                      No applications yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
