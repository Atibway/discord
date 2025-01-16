import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessages } from "@/components/chat/ChatMessages";
import Mediaroom from "@/components/media-room";
import { currentProfile } from "@/lib/auth";
import { getOrCreateConversation } from "@/lib/conversation";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
  params:{
    memberId: string;
    serverId: string;
  },
  searchParams:{
    video?:boolean
  }
}

const MemberIdPage = async({
  params,
  searchParams
}: MemberIdPageProps) => {
  const profile = await currentProfile()

 

const currentMember = await db.member.findFirst({
  where:{
    serverid: params.serverId,
    profileid: profile?.id
  },
  include:{
    profile: true
  }
})

if(!currentMember){
  return redirect("/")
}

const conversation = await  getOrCreateConversation(currentMember.id , params.memberId)

if(!conversation){
  return redirect(`/servers/${params.serverId}`)
}

const {memberOne, memberTwo} = conversation


const othermember = memberOne.profileid === profile?.id? memberTwo: memberOne


return (
  <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
    <ChatHeader
    imageUrl={othermember.profile.image ?? ""}
    name={othermember.profile.name ?? ""}
    serverId={params.serverId}
    type="conversation"
    />
{!searchParams.video && (
<>

<ChatMessages
member={currentMember}
name={othermember.profile.name ?? ""}
chatid={conversation.id}
type="conversation"
apiUrl="/api/direct-messages"
paramKey="conversationId"
paramValue={conversation.id}
socketUrl="/api/socket/direct-messages"
socketquery={{
  conversationId: conversation.id
}}

/>

<ChatInput
 name={othermember.profile.name ?? ""}
  type="conversation"
  apiUrl="/api/socket/direct-messages"
  query={{
    conversationId: conversation.id
  }}
/>
</>
)}
{searchParams.video && (
   <Mediaroom
    chatId={conversation.id}
    video={true}
     audio={true}
                />
)}
  </div>
)
}

export default MemberIdPage