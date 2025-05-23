"use client"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import qs from "query-string"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useParams } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"
import { ChannelType } from "@prisma/client"
import { useEffect } from "react"


const formSchema = z.object({
  name: z.string().min(1, {
    message: "Channel name must be at least 2 characters.",
  }).refine(
    name => name !== "general",
    {
      message: "Channel name cannot be 'general'"
    }
  ),
  type: z.nativeEnum(ChannelType)
})

export function CreateChannelModal() {
const {isOpen, onClose, type, data} = useModal();
const params = useParams()
const {channelType}= data
const isModalOpen = isOpen && type === "createChannel";


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          type: ChannelType.TEXT
        },
      })
useEffect(()=>{
if(channelType){
  form.setValue("type", channelType)
}else {
  form.setValue("type", ChannelType.TEXT)
}
}, [channelType, form])
      const isLoading = form.formState.isSubmitting;

      async function onSubmit(values: z.infer<typeof formSchema>) {
       try {
        const url = qs.stringifyUrl({
          url: `/api/channels`,
          query:{
            serverId: params?.serverId
          }
        })
  
        await axios.post(url, values);
        form.reset();
        onClose();
        window.location.reload()
       } catch (error) {
        console.log(error);
        
       }
      }
const handleClose = () => {
  form.reset()
  onClose()
  window.location.reload()
}
    
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-white/70 text-black p-o overflow-hidden rounded-2xl lg:rounded-2xl">
        <DialogHeader className="">
          <DialogTitle className="text-2xl text-center font-bold">
           Create Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="space-y-1 px-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel
              className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
              >Channel name</FormLabel>
              <FormControl>
                <Input 
                disabled={isLoading}
                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                placeholder="Enter Channel name"
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel
              className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
              >Channel Type</FormLabel>
              <Select 
              disabled={isLoading}
              onValueChange={field.onChange}
              defaultValue={field.value}
              >
              <FormControl>
                <SelectTrigger
                className="bg-zinc-300/50 border-0 ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                >
                  <SelectValue placeholder="Select a channel type"/>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                    {Object.values(ChannelType).map((type) => (
                      <SelectItem 
                      key={type} 
                      value={type}
                      className="capitalize"
                      >
                        {type.toLowerCase()}
                      </SelectItem>
                    ))}
              </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>

        <DialogFooter className="bg-gray-100 px-4 py-2">
          <Button variant={"primary"} disabled={isLoading} >Create</Button>
        </DialogFooter>
      </form>
    </Form>
      </DialogContent>
    </Dialog>
  )
}
