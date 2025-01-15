"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Plus, SendHorizontal, Smile } from "lucide-react"
import qs from "query-string"
import axios from "axios"
import { useModal } from "@/hooks/use-modal-store"
import { EmojiPicker } from "../EmojiPicker"
import { useRouter } from "next/navigation"

interface ChartInputProps {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: "conversation" | "channel"
}

const formSchema = z.object({
    content: z.string()
  })

export const ChatInput = ({
apiUrl,
query,
name,
type
}: ChartInputProps) => {
const {onOpen} = useModal()
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  })

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query
      })

      await axios.post(url, values);
form.reset()
router.refresh()
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex items-center gap-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative">
                  {/* File upload button */}
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 h-[32px] w-[32px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
  
                  {/* Input field */}
                  <Input
                    disabled={isLoading}
                    className="pl-14 pr-20 py-4 bg-zinc-200/90 dark:bg-zinc-700/75 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
  
        {/* Emoji Picker */}
        <div className="flex items-center justify-center">
          <EmojiPicker
            onChange={(emoji: string) => form.setValue("content", `${form.getValues("content")} ${emoji}`)}
          />
        </div>
  
        {/* Send Button */}
        <Button
          variant="primary"
          className="h-12 w-12 rounded-full flex items-center justify-center"
          disabled={isLoading}
        >
          <SendHorizontal className="h-6 w-6" />
        </Button>
      </div>
    </form>
  </Form>
  
  
  )
}
