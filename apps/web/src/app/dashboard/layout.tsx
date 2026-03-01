
import { LogoutButton } from "@/components/LogoutButton";
import { SyncUser } from "@/components/SyncUser";
import { auth0 } from "@/lib/auth0";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--background)]">
      <header className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex justify-between items-center">
        <nav className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-lg font-semibold text-neutral-900 dark:text-white hover:text-accent dark:hover:text-accent-light transition-colors"
          >
            Recall
          </Link>
          <Link
            href="/dashboard/applications"
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Applications
          </Link>
          <Link
            href="/dashboard/calendar"
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Calendar
          </Link>
          <Link
            href="/dashboard/analytics"
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Analytics
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <SyncUser />
          <LogoutButton />
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
