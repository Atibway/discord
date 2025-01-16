"use client"

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "../TooltipActions";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSearchProps {
    label: string;
    role?: MemberRole;
    sectionType: "channels" | "members";
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfiles;
}

export const ServerSection = ({
    label,
    role,
    sectionType,
    channelType,
}: ServerSearchProps) => {
const {onOpen} = useModal()

  return (
    <div className="flex items-center justify-between px-2">
<p className="text-xs uppercase font-medium text-zinc-500 dark:text-zinc-400">
   {label} 
</p>
{role !== MemberRole.GUEST && sectionType === "channels" && (
    <ActionTooltip label="Create Channel" side="top">
<button
onClick={()=> onOpen("createChannel", {channelType})}
className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
>
    <Plus className="h-4 w-4"/>
</button>
    </ActionTooltip>
)}

    </div>
  )
}
