"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getServerWithMember } from "@/actions/server";
import { Channel } from "@prisma/client";
import { fetchToken } from "@/firebase";
import { updateFcmTokenServer } from "@/actions/updateFCMtoken";

interface ServerTypes {
  id: string;
  profileid: string;
  name: string;
  inviteCode: string;
  Channel: Channel[];
}

const ServerIdPage = ({ params }: { params: { serverId: string } }) => {
  const [server, setServer] = useState<ServerTypes | undefined>(undefined);
  const profile = useCurrentUser();
  const router = useRouter();

  

  useEffect(() => {
    if (profile && params.serverId) {
      const fetchServer = async () => {
        try {
          const res = await getServerWithMember(profile?.id as string, params.serverId);
          if (res) {
            setServer(res as ServerTypes);
          }
        } catch (error) {
          console.error("Error fetching server:", error);
        }
      };

      fetchServer();
    }
  }, [profile, params.serverId]);

  useEffect(() => {
    const fetchAndSetToken = async () => {
      try {
        const fetchedToken = await fetchToken();
        if (fetchedToken) {
        
          // Ensure profile is available before updating
          if (profile) {
            await updateFcmTokenServer(profile.id as string, params.serverId, fetchedToken as string).then((res)=>{
              console.log(res);
              
            })
          }
        }
      } catch (error) {
        console.error("Error fetching or updating token:", error);
      }
    };

    if (!profile) {
      router.push("/login");
    } else {
      fetchAndSetToken();
    }
  }, [profile, params.serverId, router]);

  useEffect(() => {
    if (server) {
      const initialChannel = server?.Channel[0];

      if (!initialChannel || initialChannel.name !== "general") {
        console.error("No 'general' channel found for this server.");
        return;
      }

      router.push(`/servers/${params.serverId}/channels/${initialChannel.id}`);
    }
  }, [server, router, params.serverId]);

  if (!server) return <div>Loading...</div>;

  return null;
};

export default ServerIdPage;
