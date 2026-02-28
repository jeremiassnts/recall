"use client";

import Link from "next/link";

export function LogoutButton() {
  return (
    <Link
      href="/api/auth/logout?returnTo=/"
      className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-accent dark:hover:text-accent-light transition-colors"
    >
      Log out
    </Link>
  );
}
