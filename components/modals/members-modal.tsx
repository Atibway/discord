"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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


import { useModal } from "@/hooks/use-modal-store"
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvator } from "../UserAvator";
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useState } from "react";
import qs from "query-string"
import { MemberRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";

const roleIconMap = {
  "GUEST": null,
  "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  "ADMIN": <ShieldAlert className="h-4 w-4 text-rose-500"/>
}

export function MembersModal() {
const {isOpen, onOpen, onClose, type, data} = useModal();
const [loadingId, setLoadingId] = useState("")
const router = useRouter()
const {server} = data as {server: ServerWithMembersWithProfiles}

const isModalOpen = isOpen && type === "members";

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

  const response = await axios.patch(url, {role})

  router.refresh();
  onOpen("members", {server: response.data})

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

const handleClose = ()=>{
      onClose()
      window.location.reload()
    }

    
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="dark:bg-white/70 bg-white text-black overflow-hidden rounded-2xl lg:rounded-2xl">
        <DialogHeader className="">
          <DialogTitle className="text-2xl text-center font-bold">
           Manage members
          </DialogTitle>
       <DialogDescription className=" text-center text-zinc-500">
{server?.members?.length} members
       </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
{server?.members?.map((member)=> (
  <>
  <div key={member.id} className="flex items-center gap-x-2 mb-5">
<UserAvator src={member.profile.image ?? ''}/>
<div className="flex flex-col gap-y-1">

<div className="text-xs font-semibold flex items-center gap-x-1">
{member.profile.name}
{roleIconMap[member.role]}
</div>
<p className="text-xs text-zinc-500">
  {member.profile.email}
</p>
</div>
  {server.profileid !== member.profileid && loadingId !== member.id && (
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
  )}
  {loadingId === member.id && (
    <Loader2 className="animate-spin text-zinc-500 ml-auto"/>
  )}
  </div>
  </>
))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
