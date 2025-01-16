"use client"

import { Hash } from "lucide-react";

interface ChatWelcomeProps {
     type: "channel" | "conversation";
     name: string
}

export const ChatWelcome = ({
type,
name
}: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-4 mb-4">
{type === "channel" && (
    <div className="w-[75px] h-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
<Hash className="h-12 w-12 text-white"/>
    </div>
)}

<p className="text-xl md:text-3xl font-bold dark:text-white">
    {type === "channel"? "Welcome to #": ""} {name}
</p>
<p className="dark:text-primary-foreground">
    {type === "channel"
    ? `This is the start of the #${name} channel`
    :`This is the start of your conversation with ${name}`
}
</p>
    </div>
  )
}
