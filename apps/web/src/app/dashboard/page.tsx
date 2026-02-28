import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
        Dashboard
      </h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        Welcome back. Manage your job applications from one place.
      </p>
      <Link
        href="/dashboard/applications"
        className="mt-6 inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-colors"
      >
        View applications
      </Link>
    </div>
  );
}
