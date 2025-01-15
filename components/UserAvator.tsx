"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

interface Useravatorprops {
src?: string;
className?: string
}

export const UserAvator = ({
src,
className
}: Useravatorprops) => {
    const user = useCurrentUser();

    return (
                <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", 
                    className
                )}>
                    <AvatarImage src={src || ""} />
                    <AvatarFallback className="bg-sky-500">
                        <FaUser className="text-white" />
                    </AvatarFallback>
                </Avatar>
           
    );
};
