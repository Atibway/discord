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
  import { ActionTooltip } from "../TooltipActions";
  import { Check, Gavel, MoreVertical, Shield, ShieldCheck, ShieldQuestion } from "lucide-react";
import axios from "axios";
import { Member, MemberRole, Server, User } from "@prisma/client";
import { useModal } from "@/hooks/use-modal-store";
import qs from "query-string";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface ServermemberProps {
    member: Member & {profile: User};
    server: Server;
    setLoadingId: Dispatch<SetStateAction<string>>
}

export const ServerManageMember = ({
    member,
    server,
    setLoadingId
}: ServermemberProps) => {
    const { onOpen} = useModal();
    const router = useRouter();


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

  return (
    <ActionTooltip  label={`Manage ${member.profile.name}`} side="top">
     <div className="mr-4">
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
  )
}
