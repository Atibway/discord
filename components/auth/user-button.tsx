"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { LogOutIcon, User } from "lucide-react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";

export const UserButton = () => {
    const user = useCurrentUser();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className="bg-sky-500">
                        <FaUser className="text-white" />
                    </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-black dark:text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-2">
                <LogoutButton>
                    <DropdownMenuItem>
                        <LogOutIcon className="h-4 w-4 mr-2" />
                        Logout
                    </DropdownMenuItem>
                </LogoutButton>
                {user && (
                    <Link href="/frontend/settings">
                        <DropdownMenuItem>
                            <User className="h-4 w-4 mr-2" />
                            Settings
                        </DropdownMenuItem>
                    </Link>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
