import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessages } from '@/components/chat/ChatMessages';
import Mediaroom from '@/components/media-room';
import { currentProfile } from '@/lib/auth';
import { db } from '@/lib/db';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react';

interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string;
    };
}

const channelIdPage = async ({ params }: ChannelIdPageProps) => {
    const profile = await currentProfile();
    if (!profile) {
        return redirect('/login');
    }

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId,
        },
    });

    const member = await db.member.findFirst({
        where: {
            serverid: params.serverId,
            profileid: profile.id,
        },
    });

    if (!channel || !member) {
        redirect('/');
    }

    return (
        <div className='bg-white dark:bg-[#313338] flex flex-col h-screen'>
            <ChatHeader name={channel.name} serverId={channel.serverid} type='channel' />

            {channel.type === ChannelType.TEXT && (
              <>
              <ChatMessages
                  name={channel.name}
                  member={member}
                  chatid={channel.id}
                  apiUrl={'/api/messages'}
                  socketUrl={'/api/socket/messages'}
                  socketquery={{
                      channelId: channel.id,
                      serverId: channel.serverid,
                  }}
                  paramKey={'channelId'}
                  paramValue={channel.id}
                  type={'channel'}
              />
              <ChatInput
                  name={channel.name}
                  type='channel'
                  apiUrl='/api/socket/messages'
                  query={{
                      channelId: channel.id,
                      serverId: channel.serverid,
                  }}
              />
              </>
            )}

            {channel.type === ChannelType.AUDIO && (
              <Mediaroom
              chatId={channel.id}
              video={false}
              audio={true}
              />
            )}
            {channel.type === ChannelType.VIDEO && (
              <Mediaroom
              chatId={channel.id}
              video={true}
              audio={true}
              />
            )}
        </div>
    );
};

export default channelIdPage;
