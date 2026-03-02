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
  );
}
