import { currentProfile } from '@/lib/auth';
import { db } from '@/lib/db';
import { ChannelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { ServerHeader } from './ServerHeader';
import { ScrollArea } from '../ui/scroll-area';
import { ServerSearch } from './ServerSearch';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { Separator } from '../ui/separator';
import { ServerSection } from './ServerSection';
import { ServerChannel } from './ServerChannel';
import { Servermember } from './Servermember';

interface ServerSideBarProps {
    serverId: string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className='mr-2 h-4 w-4'/>,
    [ChannelType.AUDIO]: <Mic className='mr-2 h-4 w-4'/>,
    [ChannelType.VIDEO]: <Video className='mr-2 h-4 w-4'/>
}

const roleIcon ={
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4 mr-2 text-indigo-500'/>,
    [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 mr-2 text-destructive'/>
}
export const ServerSideBar = async({
    serverId
}: ServerSideBarProps) => {

    const server = await db.server.findUnique({
    where:{
      id: serverId
    },
    include:{
        Channel:{
            orderBy:{
                createdAt: "asc"
            }
        },
        members:{
            include:{
                profile: true
            },
            orderBy:{
                role: "asc"
            }
        }
    }
    })
    const profile = await currentProfile()
    const textChannels = server?.Channel.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = server?.Channel.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.Channel.filter((channel) => channel.type === ChannelType.VIDEO)
    const members = server?.members.filter((member) => member.profileid !== profile?.id)

    if(!server){
        return redirect("/")
    }

    const role = server.members.find((member) => member.profileid === profile?.id)?.role

    
  return (
    <div className='flex flex-col h-full dark:text-white w-full  dark:dark:bg-[#292a2d] bg-[#F2F3F5]'>
        <ServerHeader
        server={server}
        role={role}
        />
        <ScrollArea>
            <div className='mt-2'>
<ServerSearch
data={[
    {
        label: "Text Channels",
        type: "channel",
        data: textChannels?.map((channel)=> ({
            id: channel.id,
            name: channel.name,
            icon: iconMap[channel.type]
        }))
    },
    {
        label: "Voice Channels",
        type: "channel",
        data: audioChannels?.map((channel)=> ({
            id: channel.id,
            name: channel.name,
            icon: iconMap[channel.type]
        }))
    },
    {
        label: "Video Channels",
        type: "channel",
        data: videoChannels?.map((channel)=> ({
            id: channel.id,
            name: channel.name,
            icon: iconMap[channel.type]
        }))
    },
    {
        label: "Member",
        type: "member",
        data: members?.map((member)=> ({
            id: member.id,
            name: member.profile.name || 'Unknown',
            icon: roleIcon[member.role]
        }))
    },
]}
/>
            </div>
            <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2'/>
            {!!textChannels?.length && (
                <div className='mb-2'>
<ServerSection
sectionType='channels'
channelType={ChannelType.TEXT}
role={role}
label='Text Channels'
/>
<div className='space-y-[2px]'>
{textChannels.map((channel)=> (
<ServerChannel
key={channel.id}
channel={channel}
role={role}
server={server}
/>
))}
</div>
                </div>
            )}
            {!!audioChannels?.length && (
                <div className='mb-2'>
<ServerSection
sectionType='channels'
channelType={ChannelType.AUDIO}
role={role}
label='voice Channels'
/>
<div className='space-y-[2px]'>
{audioChannels.map((channel)=> (
<ServerChannel
key={channel.id}
channel={channel}
role={role}
server={server}
/>
))}
</div>
                </div>
            )}
            {!!videoChannels?.length && (
                <div className='mb-2'>
<ServerSection
sectionType='channels'
channelType={ChannelType.VIDEO}
role={role}
label='video Channels'
/>
<div className='space-y-[2px]'>
{videoChannels.map((channel)=> (
<ServerChannel
key={channel.id}
channel={channel}
role={role}
server={server}
/>
))}
</div>
                </div>
            )}
            {!!members?.length && (
                <div className='mb-2'>
<ServerSection
sectionType='members'
channelType={ChannelType.VIDEO}
role={role}
label='Members'
server={server}
/>
{members.map((member)=> (
<Servermember
key={member.id}
member={member}
server={server

}
/>
))}
                </div>
            )}
        </ScrollArea>
    </div>
  )
}
