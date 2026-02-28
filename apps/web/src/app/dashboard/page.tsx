import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { SyncUser } from "@/components/SyncUser";
import { LogoutButton } from "@/components/LogoutButton";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--background)]">
      <header className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Recall
        </h1>
        <LogoutButton />
      </header>
      <main className="p-6">
        <SyncUser />
        <p className="text-neutral-600 dark:text-neutral-400">
          Welcome, {session.user.name ?? session.user.email}.
        </p>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-500">
          Phase 1 complete. Job pipeline and more coming in Phase 2.
        </p>
      </main>
    </div>
  );
}
