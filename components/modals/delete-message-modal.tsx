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
import qs from "query-string"

export function DeleteMessageModal() {
const [isLoading, setIsLoading]= useState(false)
const {isOpen, onClose, type, data} = useModal();
const {apiUrl, query} = data

const isModalOpen = isOpen && type === "deleteMessage";

const handleClose = ()=>{
      onClose()
    }

    const onClick= async ()=> {
      try {
        setIsLoading(true)

        const url = qs.stringifyUrl({
          url: apiUrl || "",
          query
        })
      
        await axios.delete(url)
         onClose()
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
           Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
             <span className="font-semibold text-indigo-500">The Message will be permanently deleted</span> 
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
