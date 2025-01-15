"use client"

import { Member, MemberRole, User } from "@prisma/client";
import { ActionTooltip } from "../TooltipActions";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash, X, Ban } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios";
import qs from "query-string";
import { useModal } from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";

const formSchema = z.object({
  content: z.string().min(1),
})

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & {
        profile: User
    };
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketquery: Record<string, string>;
    type?: "channel" | "conversation";
}

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="h-4 w-4 text-rose-500" />
}

export const ConversationChatItem = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketquery,
    type = "conversation"
}: ChatItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const { onOpen } = useModal();
    const params = useParams();
    const router = useRouter();

    const onMemberClick = () => {
        if (member.id === currentMember.id) {
            return;
        }
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
    }

    const isSender = member.id === currentMember.id;
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPDF = fileUrl && fileUrl.endsWith("/pdf");
    const isImage = fileUrl && fileUrl.endsWith("/image");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content,
        },
    })

    useEffect(() => {
        form.reset({ content: content });
    }, [content]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" || event.keyCode === 27) {
                setIsEditing(false);
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketquery
            });
            await axios.patch(url, values);
            form.reset();
            setIsEditing(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={cn(
            "relative group flex items-start mb-4 p-2",
            isSender ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "flex flex-col max-w-[70%] rounded-lg p-3",
                isSender ? "bg-green-700 text-white" : "bg-white text-black",
                deleted && "bg-gray-200 text-gray-500"
            )}>
                {type === "channel" && (
                    <div className="flex items-center mb-1">
                        <p onClick={onMemberClick} className="text-xs font-semibold hover:underline cursor-pointer mr-1">
                            {member.profile.name}
                        </p>
                        <ActionTooltip label={member.role}>
                            {roleIconMap[member.role]}
                        </ActionTooltip>
                    </div>
                )}

                {isImage && (
                    <a
                        href={fileUrl?.replace("/image", "")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative aspect-square rounded-md mt-2 overflow-hidden flex items-center bg-secondary h-48 w-48 mb-2"
                    >
                        <Image 
                            src={fileUrl.replace("/image", "") || "/placeholder.svg"}
                            alt="Attached image"
                            fill
                            className="object-cover"
                        />
                    </a>
                )}

                {isPDF && (
                    <div className="flex items-center p-2 mt-2 rounded-md bg-background/10 mb-2">
                        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                        <a
                            href={fileUrl?.replace("/pdf", "")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                        >
                            PDF File
                        </a>
                    </div>
                )}

                {!isEditing ? (
                    <p className={cn(
                        "text-sm",
                        deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs"
                    )}>
                        {content}
                        {isUpdated && !deleted && (
                            <span className="text-[10px] mx-2 opacity-50">(edited)</span>
                        )}
                    </p>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center w-full gap-x-2">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 text-zinc-600 dark:text-zinc-200"
                                                placeholder="Edited message"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button disabled={isLoading} size="sm" variant="primary">Save</Button>
                        </form>
                    </Form>
                )}

                <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] opacity-50">{timestamp}</span>
                    {canDeleteMessage && (
                        <div className="flex items-center gap-x-2">
                            {canEditMessage && !isEditing && (
                                <ActionTooltip label="Edit">
                                    <Edit
                                        onClick={() => setIsEditing(true)}
                                        className="cursor-pointer w-4 h-4 opacity-50 hover:opacity-100 transition"
                                    />
                                </ActionTooltip>
                            )}
                            <ActionTooltip label="Delete">
                                <Trash
                                    onClick={() => onOpen("deleteMessage", {
                                        apiUrl: `${socketUrl}/${id}`,
                                        query: socketquery
                                    })}
                                    className="cursor-pointer w-4 h-4 opacity-50 hover:opacity-100 transition"
                                />
                            </ActionTooltip>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

