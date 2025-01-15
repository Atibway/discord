"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useModal } from "@/hooks/use-modal-store"
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function DeleteServerModal() {
  const router = useRouter()
const [isLoading, setIsLoading]= useState(false)
const {isOpen, onClose, type, data} = useModal();
const {server} = data

const isModalOpen = isOpen && type === "deleteServer";

const handleClose = ()=>{
      onClose()
    }

    const onClick= async ()=> {
      try {
        setIsLoading(true)
         await axios.delete(`/api/servers/${server?.id}`)
         onClose()
         router.push("/")
         router.refresh()
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
           Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
             <span className="font-semibold text-indigo-500">{server?.name}</span> will be permanently deleted
          </DialogDescription>
        </DialogHeader>
     <DialogFooter className="bg-gray-100 dark: bg-primary-foreground/50 rounded-lg px-6 py-4">
<div className="flex items-center justify-between w-full">
<Button
disabled={isLoading}
onClick={handleClose}
variant={"destructive"}
>
  Cancel
</Button>
<Button
disabled={isLoading}
onClick={onClick}
variant={"primary"}
>
  Confirm
</Button>
</div>
     </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
