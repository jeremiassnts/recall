"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { usePathname } from "next/navigation";
import { LoggedUser } from "./LoggedUser";
import { ThemeToggle } from "./ThemeToggle";
import { SidebarTrigger } from "./ui/sidebar";

const headerTitles = {
    "/dashboard": "Dashboard",
    "/dashboard/applications": "Applications",
    "/dashboard/calendar": "Calendar"
}

export function Header() {
    const { user } = useUser();
    const pathname = usePathname();

    return (
        <header className="flex flex-row justify-between items-center w-full max-h-screen p-4">
            <div className="flex flex-row justify-start items-center gap-2">
                <SidebarTrigger />
                <h1 className="text-lg font-bold">{headerTitles[pathname as keyof typeof headerTitles]}</h1>
            </div>
            <div className="flex flex-row justify-center items-center gap-2">
                <ThemeToggle />
                <LoggedUser showUserInfo={false} />
            </div>
        </header>
    );
}