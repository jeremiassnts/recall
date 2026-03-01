"use client";

export function LogoutButton() {
  return (
    <a
      href="/auth/logout"
      className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-accent dark:hover:text-accent-light transition-colors"
    >
      Log out
    </a>
  );
}
