
import { currentProfile } from "@/lib/authOfPages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if (req.method !== "DELETE" && req.method !== "PATCH") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const profile = await currentProfile(req, res);
        const { content } = req.body;
        const { directMessageId, conversationId } = req.query;

     

        if (!profile) return res.status(401).json({ error: "Unauthorized" });
      
        if (!conversationId) return res.status(400).json({ error: "Conversation ID Missing" });
        if (!directMessageId) return res.status(400).json({ error: "Direct Message ID Missing" });




        const conversation = await db.conversation.findFirst({
            where:{
        id: conversationId as string,
        OR:[
            {
            memberOne:{
                profileid: profile.id
            }
        },
        {
            memberTwo:{
                profileid: profile.id
            }
        }
          ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        if (!conversation) return res.status(404).json({ message: "Conversation Not Found" });

        const member = conversation.memberOne.profileid === profile.id ? conversation.memberOne: conversation.memberTwo;

        if (!member) return res.status(404).json({ message: "Member5 Not Found" });
       
        let directMessage = await db.directMessage.findFirst({
            where: { 
                id: directMessageId as string, conversationId: conversationId as string 
            },
            include: {
                member: { include: { profile: true } },
            },
        });

        if (!directMessage || directMessage.deleted) return res.status(404).json({ message: "Message Not Found" });

        const isMessageOwner = directMessage.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;

        if (!canModify) return res.status(403).json({ message: "Unauthorized" });

        if (req.method === "DELETE") {
            directMessage = await db.directMessage.update({
                where: { id: directMessageId as string },
                data: {
                    fileUrl: null,
                    content: "This message has been deleted",
                    deleted: true,
                },
                include: {
                    member: { include: { profile: true } },
                },
            });
        }

        if (req.method === "PATCH") {
            if (!isMessageOwner) return res.status(403).json({ message: "Unauthorized" });

            directMessage = await db.directMessage.update({
                where: { id: directMessageId as string },
                data: { content },
                include: {
                    member: { include: { profile: true } },
                },
            });
        }

        const updateKey = `chat:${conversation.id}:messages:update`;
        res?.socket?.server?.io?.emit(updateKey, directMessage);

        return res.status(200).json(directMessage);
    } catch (error) {
        console.error("MESSAGE_ID ERROR:", error);
        return res.status(500).json({ message: "Internal Error" });
    }
}
