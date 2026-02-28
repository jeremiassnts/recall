"use client";

import { useEffect, useState } from "react";

export function SyncUser() {
  const [status, setStatus] = useState<"idle" | "syncing" | "done" | "error">("idle");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus("syncing");
      try {
        const res = await fetch("/api/sync-user", { method: "POST" });
        if (!cancelled) {
          setStatus(res.ok ? "done" : "error");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "error") {
    return (
      <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
        Could not sync your account. Check that the API is running.
      </p>
    );
  }
  return null;
}
