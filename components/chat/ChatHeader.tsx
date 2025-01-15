import { Hash, Menu } from "lucide-react";
import MobileToggle from "../MobileToggle";
import { UserAvator } from "../UserAvator";
import { SocketIndicator } from "../socket-indicator";
import { ChatVideoButton } from "./chat-video-button";

interface ChatheaderProps {
    serverId: string;
    name: string;
    type: "channel" | "conversation";
    imageUrl?: string
}

export const ChatHeader = ({
serverId,
name,
type,
imageUrl
}: ChatheaderProps) => {
  return (
    <div className="text-sm font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
<MobileToggle serverId={serverId}/>
{type === "channel" && (
    <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-500 mr-2"/>
)}

{type === "conversation" && (
    <UserAvator
    src={imageUrl}
    className="h-8 w-8 md:h-8 md:w-8 mr-2"
    />
)}

<p className="font-semibold text-sm text-black dark:text-white">
    {name}
</p>
<div className="ml-auto flex items-center">
    {type === "conversation" && (
        <ChatVideoButton/>
    )}
<SocketIndicator/>
</div>
    </div>
  )
}
