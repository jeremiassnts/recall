"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { LogOutIcon } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function Header() {
    const { user } = useUser();
    return (
        <header className="flex flex-row justify-between items-center w-full max-h-screen p-4">
            <h1 className="text-lg font-bold">Dashboard</h1>
            <div className="flex flex-row justify-center items-center gap-4">
                <ThemeToggle />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Avatar>
                                <AvatarImage src={user?.picture ?? ""} alt={user?.name ?? ""} />
                                <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border-[1px] border-gray-200 dark:border-gray-800 rounded-md">
                        <DropdownMenuItem>
                            <LogOutIcon />
                            <a href="/auth/logout">Sign Out</a>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}