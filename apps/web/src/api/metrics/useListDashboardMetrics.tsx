import type { DashboardMetrics } from "@recall/types";
import { useQuery } from "@tanstack/react-query";

export function useListDashboardMetrics() {
    return useQuery<DashboardMetrics, Error>({
        queryKey: ["dashboard"],
        queryFn: async function () {
            const res = await fetch("/api/dashboard");
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error ?? "Failed to load dashboard metrics");
            }
            return res.json();
        },
    });
}