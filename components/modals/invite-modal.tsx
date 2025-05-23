"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useModal } from "@/hooks/use-modal-store"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {  CheckCheck, Copy, RefreshCcw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

export function InviteModal() {
const [copied, setCopied]= useState(false)
const [isLoading, setIsLoading]= useState(false)
const {isOpen,onOpen, onClose, type, data} = useModal();
const {server} = data
const origin = useOrigin()
const isModalOpen = isOpen && type === "invite";
const inviteUrl = `${origin}/invite/${server?.inviteCode}`

const onCopy = ()=> {
  navigator.clipboard.writeText(inviteUrl)
  setCopied(true)
  setTimeout(()=>{
    setCopied(false)
  }, 1000)
}

const handleClose = ()=>{
      onClose()
    }

    const onNew = async ()=> {
      try {
        setIsLoading(true)
        const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)

        onOpen("invite", {server: response.data})
      } catch (error) {
        console.log(error);
      }finally{
        setIsLoading(false)
      }
    }
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-white/70 text-black p-o overflow-hidden rounded-2xl lg:rounded-2xl">
        <DialogHeader className="">
          <DialogTitle className="text-2xl text-center font-bold">
           Invite Friends
          </DialogTitle>
        </DialogHeader>
       <div className="p-6">
<Label
className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
>
Server Invite link
</Label>
<div className="flex items-center mt-2 gap-x-2">
<Input
disabled={isLoading}
className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
value={inviteUrl}
/>
<Button 
disabled={isLoading}
onClick={onCopy} 
variant={"ghost"} 
size={"icon"}
>
  {copied
  ?<CheckCheck className="w-4 h-4 text-green-600"/>
  :<Copy className="w-4 h-4"/>}
</Button>
</div>

<Button
onClick={onNew}
disabled={isLoading}
variant={"link"}
size={"sm"}
className="text-xs text-zinc-500 mt-4"
>
  Generate a new link
  <RefreshCcw className="w-4 h-4 ml-2"/>
</Button>
       </div>
      </DialogContent>
    </Dialog>
  )
}
