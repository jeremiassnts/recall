"use client";
import { useListDashboardMetrics } from "@/api/metrics/useListDashboardMetrics";
import { MetricCard } from "@/components/MetricCard";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleCheck, CircleDollarSign, CircleOff, Send } from "lucide-react";

export function DashboardMetrics() {
    const { data: metrics, isLoading, error } = useListDashboardMetrics();

    return (
        <>
            {isLoading && <div className="grid grid-cols-4 gap-4 px-4">
                <Skeleton className="h-[150px] bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-[150px] bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-[150px] bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-[150px] bg-gray-200 dark:bg-gray-700" />
            </div>}
            {!isLoading && <div className="grid grid-cols-4 gap-4 px-4">
                <MetricCard label="Total applications" value={metrics?.total ?? 0} icon={<Send className="w-3 h-3 text-white" />} />
                <MetricCard label="Active" value={metrics?.active ?? 0} icon={<CircleCheck className="w-3 h-3 text-white" />} />
                <MetricCard label="Rejected" value={metrics?.rejected ?? 0} icon={<CircleOff className="w-3 h-3 text-white" />} />
                <MetricCard label="Offers" value={metrics?.offers ?? 0} icon={<CircleDollarSign className="w-3 h-3 text-white" />} />
            </div>}
        </>
    );
}
