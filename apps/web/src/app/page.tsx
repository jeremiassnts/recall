import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { LoginPanel } from "@/components/LoginPanel";
import { InfoPanel } from "@/components/InfoPanel";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function LoginPage() {
  const session = await getSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="relative flex-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-16 bg-white dark:bg-[var(--background)] border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800">
        <ThemeToggle className="absolute top-4 right-4 md:top-6 md:right-6" />
        <LoginPanel />
      </div>
      <InfoPanel />
    </div>
  );
}
