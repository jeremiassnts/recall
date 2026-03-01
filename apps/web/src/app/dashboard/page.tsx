"use client";
import { DashboardApplications } from "@/components/DashboardApplications";
import { DashboardMetrics } from "@/components/DashboardMetrics";

export default function DashboardPage() {
  return (
    <section>
      <DashboardMetrics />
      <div className="grid grid-cols-2 gap-2 p-4">
        <DashboardApplications />
      </div>
    </section>
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
