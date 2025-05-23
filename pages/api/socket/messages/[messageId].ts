
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
        const { serverId, channelId, messageId } = req.query;


        if (!profile) return res.status(401).json({ error: "Unauthorized" });
        if (!serverId) return res.status(400).json({ error: "Server ID Missing" });
        if (!channelId) return res.status(400).json({ error: "Channel ID Missing" });
        if (!messageId) return res.status(400).json({ error: "Message ID Missing" });

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: { profileid: profile.id },
                },
            },
            include: { members: true },
        });

        if (!server) return res.status(404).json({ message: "Server Not Found" });

        const channel = await db.channel.findFirst({
            where: { id: channelId as string, serverid: serverId as string },
        });

        if (!channel) return res.status(404).json({ message: "Channel Not Found" });

        const member = server.members.find((m) => m.profileid === profile.id);

        if (!member) return res.status(404).json({ message: "Member Not Found" });

        let message = await db.message.findFirst({
            where: { id: messageId as string, channelId: channelId as string },
            include: {
                member: { include: { profile: true } },
            },
        });

        if (!message || message.deleted) return res.status(404).json({ message: "Message Not Found" });

        const isMessageOwner = message.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;

        if (!canModify) return res.status(403).json({ message: "Unauthorized" });

        if (req.method === "DELETE") {
            message = await db.message.update({
                where: { id: messageId as string },
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

            message = await db.message.update({
                where: { id: messageId as string },
                data: { content },
                include: {
                    member: { include: { profile: true } },
                },
            });
        }

        const updateKey = `chat:${channelId}:messages:update`;
        res?.socket?.server?.io?.emit(updateKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.error("MESSAGE_ID ERROR:", error);
        return res.status(500).json({ message: "Internal Error" });
    }
}
