"use client";
import { useListDashboardMetrics } from "@/api/metrics/useListDashboardMetrics";
import { MetricCard } from "@/components/MetricCard";
import { CircleCheck, CircleDollarSign, CircleOff, Send } from "lucide-react";

export default function DashboardPage() {
  const { data: metrics, isLoading, error } = useListDashboardMetrics();
  console.log(metrics);

  return (
    <div className="grid grid-cols-4 gap-4 px-10">
      <MetricCard label="Total applications" value={metrics?.total ?? 0} icon={<Send className="w-3 h-3 text-white" />} />
      <MetricCard label="Active" value={metrics?.active ?? 0} icon={<CircleCheck className="w-3 h-3 text-white" />} />
      <MetricCard label="Rejected" value={metrics?.rejected ?? 0} icon={<CircleOff className="w-3 h-3 text-white" />} />
      <MetricCard label="Offers" value={metrics?.offers ?? 0} icon={<CircleDollarSign className="w-3 h-3 text-white" />} />
    </div>
    // <div>
    //   <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
    //     Dashboard
    //   </h1>
    //   <p className="mt-2 text-neutral-600 dark:text-neutral-400">
    //     Welcome back. Manage your job applications from one place.
    //   </p>
    //   <div className="mt-6 flex flex-wrap gap-3">
    //     <Link
    //       href="/dashboard/applications"
    //       className="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-colors"
    //     >
    //       View applications
    //     </Link>
    //     <Link
    //       href="/dashboard/analytics"
    //       className="inline-flex items-center rounded-lg border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
    //     >
    //       Analytics
    //     </Link>
    //   </div>
    //   <DashboardSummary />
    // </div>
  );
}
