"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Header() {
    const { user } = useUser();
    return (
        <header className="flex flex-row justify-between items-center w-full max-h-screen p-10">
            <h1 className="text-lg font-bold">Dashboard</h1>
            <div className="flex flex-row justify-center items-center gap-4">
                <ThemeToggle />
                <Avatar>
                    <AvatarImage
                        src={user?.picture ?? ""}
                        alt={user?.name ?? ""}
                    />
                    <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}