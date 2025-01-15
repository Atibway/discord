'use client';

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  VideoConference,
} from '@livekit/components-react';

import '@livekit/components-styles';

import { useEffect, useState } from 'react';
import { Track } from 'livekit-client';
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
  }, [user?.name, chatId]);

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
    //   style={{ height: '100dvh' }}
    >
      {/* <MyVideoConference />
      <RoomAudioRenderer />
      <ControlBar /> */}
      <VideoConference/>
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}