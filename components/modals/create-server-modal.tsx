"use client"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Dialog,
  DialogContent,
  DialogDescription,
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


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileUpload } from "../file-upload"
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"


const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name must be at least 2 characters.",
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required.",
  }),
})

export function CreateServerModal() {
const {isOpen, onClose, type} = useModal();

const isModalOpen = isOpen && type === "createServer";

const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          imageUrl: ""
        },
      })

      const isLoading = form.formState.isSubmitting;

      async function onSubmit(values: z.infer<typeof formSchema>) {
       try {
        await axios.post("/api/servers", values);
        form.reset();
        router.refresh();
        onClose();
       } catch (error) {
        console.log(error);
        
       }
      }
const handleClose = () => {
  form.reset()
  onClose()
}
    
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-white/70 text-black p-o overflow-hidden rounded-2xl lg:rounded-2xl">
        <DialogHeader className="">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize Your Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="space-y-1 px-6">
            <div className="flex items-center justify-center ">
            <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
              <FileUpload 
              endpoint="serverImage"
              value={field.value}
              onChange={field.onChange}
              />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
            </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel
              className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
              >Server name</FormLabel>
              <FormControl>
                <Input 
                disabled={isLoading}
                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                placeholder="Enter server name"
                {...field}
                />
              </FormControl>
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
