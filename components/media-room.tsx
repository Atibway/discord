'use client';

import {
  LiveKitRoom,
  VideoConference,
} from '@livekit/components-react';

import '@livekit/components-styles';

import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Loader2 } from 'lucide-react';

interface MediaRoomProps {
    chatId: string;
    video: boolean;
    audio: boolean;
}

export default function Mediaroom({
chatId,
video,
audio
}:MediaRoomProps) {
  const user = useCurrentUser()
  const [token, setToken] = useState('');

  useEffect(() => {
     if(!user) return;
        const name = user.name;

    (async () => {
      try {
       
        const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [user?.name, chatId, user]);

  if (token === '') {
    return (
    <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4'/>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Loading...
        </p>
    </div>
    )
  }

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
    >
   
      <VideoConference/>
    </LiveKitRoom>
  );
}
