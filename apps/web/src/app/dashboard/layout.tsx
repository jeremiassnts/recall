
import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";
import { auth0 } from "@/lib/auth0";
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
    <div className="min-h-screen flex flex-row">
      <Menu />
      <main className="flex-1">
        <Header />
        {children}
      </main>
    </div>
  );
}
