"use client"

import { Member, MemberRole, User } from "@prisma/client";
import { UserAvator } from "../UserAvator";
import { ActionTooltip } from "../TooltipActions";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem
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
import { Ban } from 'lucide-react';
 
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

const getFileTypeSuffix = (url: string | null) => {
  if (!url) return '';
  if (url.endsWith("/image")) return "/image";
  if (url.endsWith("/pdf")) return "/pdf";
  return '';
};

export const ChatItem = ({
    id,
    timestamp,
    fileUrl,
    isUpdated,
    content,
    member,
    currentMember,
    deleted,
    socketUrl,
    socketquery,
}: ChatItemProps) => {
    const fileTypeSuffix = getFileTypeSuffix(fileUrl);
    const [isEditing, setIsEditing] = useState(false);
    const {onOpen} = useModal()
    const params = useParams()
    const router = useRouter()

    const onmemberClick = ()=> {
if(member.id === currentMember.id){
  return;
}

router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
    }

    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isImage = fileTypeSuffix === "/image";
    const isPDF = !isImage

    useEffect(()=> {
      const handleKeyDown = (event:any)=> {
        if(event.key === "Escape" || event.keyCode === 27){
            setIsEditing(false)
        }
      } 

      window.addEventListener("keydown", handleKeyDown)

      return ()=> window.removeEventListener("keyDown", handleKeyDown)
      }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          content: content,
        },
      })
const isLoading = form .formState.isSubmitting

      useEffect(()=> {
        form.reset({
            content: content,
        })
      }, [content, form])

     async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        const url = qs.stringifyUrl({
            url: `${socketUrl}/${id}`,
            query: socketquery
        })

        await axios.patch(url, values)

        form.reset()
        setIsEditing(false)
        
    } catch (error) {
        console.log(error);
        
    }
      }

     

    return (
        <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
            <div className="group flex gap-x-2 items-start w-full">
                <div onClick={onmemberClick}  className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvator src={member.profile.image ?? ""} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p onClick={onmemberClick}  className="font-semibold text-sm hover:underline hover:text-primary hover:dark:text-primary dark:text-white cursor-pointer">
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timestamp}
                        </span>
                    </div>
                    {isImage && (
                        <a
                            href={fileUrl?.replace("/image", "")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                        >
                            {fileUrl && (
                                <Image 
                                src={fileUrl.replace("/image", "")} alt="file"
                                fill
                                className="object-cover w-full h-full"
                                />
                            )}
                        </a>
                    )}

                    {fileUrl && isPDF && (
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                          href={fileUrl?.replace("/pdf", "")}
                          title={fileUrl ?? ""}
                          style={{
                            display: "block",
                            maxWidth: "200px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          PDF File
                        </a>
                       
                      </div>
                    )}
                    {!fileUrl && !isEditing && (
                      
                        <div className={cn(
                     "text-sm text-zinc-600 dark:text-zinc-300",
                     deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                    )} >

<div className="flex items-center gap-x-2">

                      {deleted && (
                        <p>
                          <Ban className="h-4 w-4" />
                        </p>
                      )}
                            {content}
</div>
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (edited)
                                </span>
                            )}
                        </div>
                    )}
                   {!fileUrl && isEditing && (
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
                               className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 text-zinc-600  dark:text-zinc-200"
                                placeholder="Edited message"
                                 {...field}
                                  />
                             </FormControl>
                           </FormItem>
                         )}
                       />
                       <Button
                       disabled={isLoading}
                       size={"sm"} variant={"primary"}>Save</Button>
                     </form>
                     <span className="hidden md:block text-[10px] mt-1 text-zinc-400">
                        Press escape to cancel, enter to save
                     </span>
                     <Button onClick={()=> setIsEditing(false)} className="md:hidden" variant={"ghost"} size={"sm"}>
                         Cancel
                     </Button>
                   </Form>
                   )} 
                </div>
                
                {canDeleteMessage && (
                    <div className="sm:hidden flex sm:group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
{canEditMessage && (
    <ActionTooltip label="Edit">
        <Edit
          onClick={()=> setIsEditing(true)}
        className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
        />
    </ActionTooltip>
)}

<ActionTooltip label="Delete">
        <Trash
       onClick={()=> onOpen("deleteMessage", {
        apiUrl: `${socketUrl}/${id}`,
        query: socketquery
       })}
        className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
        />
    </ActionTooltip>
                    </div>
                )}


            </div>
        </div>
    )
}
