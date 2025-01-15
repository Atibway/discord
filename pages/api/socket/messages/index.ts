
import { currentProfile } from "@/lib/authOfPages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";


export default async  function handler (
    req: NextApiRequest,
    res: NextApiResponseServerIo
){

    if(req.method !== "POST"){
        return res.status(405).json({error: "method not allowed"})
    }

    try {
        const profile = await currentProfile(req, res);
        const {content, fileUrl} = req.body
        const {serverId, channelId} = req.query;

        if(!profile){
            return res.status(405).json({error: "Unauthorized"})
        }
        if(!serverId){
            return res.status(405).json({error: "Server Id Misiing"})
        }
        if(!channelId){
            return res.status(405).json({error: "Channel Id Misiing"})
        }
        if(!content){
            return res.status(405).json({error: "Content Misiing"})
        }

        const server = await db.server.findFirst({
            where:{
                id: serverId as string,
                members:{
                    some:{
                        profileid: profile.id
                    }
                }
            },
            include:{
                members: true
            }
        })

        if(!server){
return res.status(404).json({message: "Server Not Found"})
        }

        const channel = await db.channel.findFirst({
            where:{
                id: channelId as string,
                serverid: serverId as string
            }
        })

        if(!channel){
            return res.status(404).json({message: "Channel Not Found"})
         }

        const member = server.members.find((member)=> member.profileid === profile.id)

        if(!member){
            return res.status(404).json({message: "member Not Found"})
         }

         const message = await db.message.create({
            data:{
                fileUrl,
                channelId: channelId as string,
                memberId: member.id,
                content: content as string
            }, include:{
                member: {
                    include: {
                        profile: true
                    }
                }
            }
         })

         const channelKey = `chat:${channelId}:messages`
         res?.socket?.server?.io?.emit(channelKey, message)

   return res.status(200).json(message)
    } catch (error) {
        console.log("MESSAGE_POST", error);
        return res.status(500).json({message: "Internal Error"})
    }

}