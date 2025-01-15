"use client"

import { cn } from "@/lib/utils";
import { ActionTooltip } from "../TooltipActions";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";


interface NavigationItemProps {
    id:string;
    imageUrl: string;
    name: string;
}


export const NavigationItem = ({
    id,
    imageUrl,
    name
}: NavigationItemProps) => {
    const params = useParams()
    const router = useRouter()
 const onClick = () => {
    router.push(`/servers/${id}`)
 }
  return (
    <ActionTooltip 
    side="right" 
    align="center" 
    label={name}>
    <button
    onClick={onClick}
    className="group mb-2 relative flex items-center">
        <div className={cn(
            "absolute left-0 bg-primary dark:bg-white rounded-r-full transition-all w-[4px]",
            params?.serverId !== id  && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]"
        )}/>
<div className={cn(
    "relative flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] bg-white/20 transition-all overflow-hidden ",
    params?.serverId === id? "dark:bg-white/70  bg-emerald-400 text-white rounded-[16px]" :"bg-slate-400"
)}>
<Image
fill
src={imageUrl}
alt={"Channel"}
/>
</div>
    </button>
    </ActionTooltip>
  )
}
