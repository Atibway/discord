"use client"
import qs from "query-string"
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
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { FileUpload } from "../file-upload"
import { useModal } from "@/hooks/use-modal-store"
import { useRouter } from "next/navigation"


const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required.",
  }),
})

export function MessageModal() {
const {isOpen, onClose, type, data}= useModal()
const router = useRouter()
const {apiUrl, query}= data
const isModalOpen = isOpen && type === "messageFile";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          fileUrl: ""
        },
      })

      const isLoading = form.formState.isSubmitting;

      const handleClose = ()=>{
        form.reset()
         onClose()
       }

      async function onSubmit(values: z.infer<typeof formSchema>) {
       try {
        const url = qs.stringifyUrl({
          url: apiUrl || "",
          query
        })
        await axios.post(url,{
          ...values,
          content: values.fileUrl
        });
        router.refresh();
        handleClose()
       } catch (error) {
        console.log(error);
       }
      }

    

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="dark:bg-white/70 bg-white text-black p-o overflow-hidden rounded-2xl lg:rounded-2xl">
        <DialogHeader className="">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an Attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-1 px-6">
            <div className="flex items-center justify-center ">
            <FormField
          control={form.control}
          name="fileUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
              <FileUpload 
              endpoint="messageFile"
              value={field.value}
              onChange={field.onChange}
              />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
            </div>
        </div>

        <DialogFooter className="bg-gray-100 px-4 py-2">
          <Button className="w-full" variant={"primary"} disabled={isLoading} >Send</Button>
        </DialogFooter>
      </form>
    </Form>
      </DialogContent>
    </Dialog>
  )
}
