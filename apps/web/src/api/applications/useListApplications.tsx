import type { JobApplication } from "@recall/types";
import { useQuery } from "@tanstack/react-query";

export function useListApplications() {
    return useQuery<JobApplication[], Error>({
        queryKey: ["applications"],
        queryFn: async function () {
            const res = await fetch("/api/applications");
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error ?? "Failed to load applications");
            }
            return res.json();
        }
    });
}