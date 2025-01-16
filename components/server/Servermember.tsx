"use client"

import { cn } from "@/lib/utils";
import { Member, MemberRole, Server, User } from "@prisma/client"
import { Loader2, ShieldAlert, ShieldCheck} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvator } from "../UserAvator";
import { useState } from "react";
import { ServerManageMember } from "./ServerManageMember";


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

    const icon = roleIcon[member.role]
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
  
    {server.profileid !== member.profileid && loadingId !== member.id && member.role === "ADMIN" && (
     <div>
      <ServerManageMember
       member={member}
       server= {server}
       setLoadingId = {setLoadingId}
      />
     </div>
  )}
  {loadingId === member.id && (
    <Loader2 className="animate-spin text-zinc-500 ml-auto"/>
  )}
    </div>
    
  

    </div>
  )
}
