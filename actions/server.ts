"use server"

import { db } from "@/lib/db";

export const getServerWithMember = async (profileId: string, serverId: string) => {
  try {
    const server = await db.server.findUnique({
      where: {
        id: serverId,
        members: {
          some: {
            profileid: profileId
          },
        },
      },
      include: {
        Channel: {
          where: {
            name: "general",
          },
        },
      },
    });

    return server;
  } catch (error) {
    console.log(error);
    return { error: "Failed to generate subscriber analytics data" };
  }
};
 