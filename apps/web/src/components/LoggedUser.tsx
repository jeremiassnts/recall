"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface LoggedUserProps {
    showUserInfo: boolean;
}

export function LoggedUser({ showUserInfo }: LoggedUserProps) {
    const { user } = useUser();
    return (
        <div className="flex flex-row items-center justify-start gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Avatar className="w-8 h-8">
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
            {showUserInfo && (
                <div className="flex flex-col items-start justify-start">
                    <span className="text-xs font-medium">{user?.name}</span>
                    <span className="text-xs text-gray-500">{user?.email}</span>
                </div>
            )}
        </div>
    );
}