import { LoginImage } from "@/components/LoginImage";
import { LoginPanel } from "@/components/LoginPanel";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth0.getSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen grid grid-cols-2 w-full">
      <LoginImage />
      <LoginPanel />
    </main>
  );
}
