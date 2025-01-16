"use client"

import { cn } from "@/lib/utils";
import { Member, MemberRole, Server, User } from "@prisma/client"
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvator } from "../UserAvator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useState } from "react";
import axios from "axios";
import qs from "query-string";
import { useModal } from "@/hooks/use-modal-store";
import { ActionTooltip } from "../TooltipActions";

interface ServermemberProps {
    member: Member & {profile: User};
    server: Server
}

const roleIcon ={
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4 mr-2 text-indigo-500'/>,
    [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 mr-2 text-destructive'/>
}

export const Servermember = ({
    member,
    server
}:ServermemberProps) => {
    const router = useRouter();
    const params = useParams()
    const [loadingId, setLoadingId] = useState("")
const { onOpen} = useModal();
    const icon = roleIcon[member.role]

    const onRoleChange = async (
        memberId: string,
        role: MemberRole
      ) => {
      try {
        setLoadingId(memberId)
        const url = qs.stringifyUrl({
          url: `/api/members/${memberId}`,
          query:{
            serverId: server.id
          }
        })
      
        await axios.patch(url, {role})
      
        router.refresh();
      
      } catch (error) {
        console.log(error);
        
      }finally{
        setLoadingId("")
      }
      }
      const onKick = async (
        memberId: string
      ) => {
      try {
        setLoadingId(memberId)
        const url = qs.stringifyUrl({
          url: `/api/members/${memberId}`,
          query:{
            serverId: server.id
          }
        })
      
        const response = await axios.delete(url)
      
        router.refresh();
        onOpen("members", {server: response.data})
      
      } catch (error) {
        console.log(error);
        
      }finally{
        setLoadingId("")
      }
      }

      const onClick=()=>{
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
      }
  return (
    <div className="flex justify-between items-center">
   <button
   onClick={onClick}
   className={cn(
    "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
    params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
   )}
   >
    <UserAvator 
    src={member.profile.image?? ""}
    className="h-8 w-8 md:h-8 md:w-8"
    />
    <p className={cn(
        "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
        params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
    )}>
        {member.profile.name}
    </p>
    {icon}
   </button>
   <div>
    {server.profileid !== member.profileid && loadingId !== member.id && (
     <ActionTooltip  label="Manage Members" side="top">
     <div className="ml-auto">
          <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical className="h-4 w-4 text-zinc-500"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center">
    <ShieldQuestion className="w-4 h-4 mr-2"/>
    <span>Role</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
            <DropdownMenuItem
            onClick={()=> onRoleChange(member.id, "GUEST")}
            >
              <Shield className="h-4 w-4 mr-2"/>
              Guest
              {member.role === "GUEST" && (
                <Check className="h-4 w-4 ml-auto"/>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={()=> onRoleChange(member.id, "MODERATOR")}
            >
              <ShieldCheck className="h-4 w-4 mr-2"/>
              Moderator
              {member.role === "MODERATOR" && (
                <Check className="h-4 w-4 ml-auto"/>
              )}
            </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
         onClick={()=> onKick(member.id)}
        >
          <Gavel className="h-4 w-4 mr-2"/>
          Kick
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    
        </div>
        </ActionTooltip>
  )}
  {loadingId === member.id && (
    <Loader2 className="animate-spin text-zinc-500 ml-auto"/>
  )}
    </div>
    
  

    </div>
  )
}
