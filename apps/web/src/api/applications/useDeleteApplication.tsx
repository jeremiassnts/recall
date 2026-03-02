import { useMutation } from "@tanstack/react-query";

export function useDeleteApplication() {
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
            if (res.status !== 204 && !res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error ?? "Failed to delete");
            }
        }
    })
}