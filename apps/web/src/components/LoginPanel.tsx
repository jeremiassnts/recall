"use client";

import Link from "next/link";

export function LoginPanel({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          Recall
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Track your job applications with clarity.
        </p>
      </div>
      <Link
        href="/api/auth/login?returnTo=/dashboard"
        className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-colors"
      >
        Login with Google
      </Link>
    </div>
  );
}
