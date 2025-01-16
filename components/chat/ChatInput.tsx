"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Plus, SendHorizontal } from 'lucide-react'
import qs from "query-string"
import axios from "axios"
import { useModal } from "@/hooks/use-modal-store"
import { EmojiPicker } from "../EmojiPicker"
import { useRouter } from "next/navigation"

interface ChatInputProps {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: "conversation" | "channel"
}

const formSchema = z.object({
    content: z.string().min(1, "Message cannot be empty")
})

export const ChatInput = ({
    apiUrl,
    query,
    name,
    type
}: ChatInputProps) => {
    const { onOpen } = useModal()
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <div className="relative">
                                        <Button
                                            type="button"
                                            onClick={() => onOpen("messageFile", { apiUrl, query })}
                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                            size="icon"
                                        >
                                            <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        </Button>
                                        <Input
                                            disabled={isLoading}
                                            className="pl-12 pr-12 py-6 bg-gray-100 dark:bg-gray-700 border-none rounded-full focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-600 text-gray-900 dark:text-gray-100"
                                            placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                                            {...field}
                                        />
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                            <EmojiPicker
                                                onChange={(emoji: string) => form.setValue("content", `${form.getValues("content")} ${emoji}`)}
                                            />
                                            <Button 
                                                type="submit" 
                                                size="icon" 
                                                variant="ghost"
                                                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                                                disabled={isLoading}
                                            >
                                                <SendHorizontal className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    )
}

