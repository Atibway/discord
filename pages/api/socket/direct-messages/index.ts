
import { currentProfile } from "@/lib/authOfPages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";


export default async  function handler (
    req: NextApiRequest,
    res: NextApiResponseServerIo
){

    if(req.method !== "POST"){
        return res.status(405).json({error: "method not allowed atii"})
    }

    try {
        const profile = await currentProfile(req, res);
        const {content, fileUrl} = req.body
        const {conversationId} = req.query;

        if(!profile){
            return res.status(405).json({error: "Unauthorized"})
        }
      
        if(!conversationId){
            return res.status(405).json({error: "Conversation Id Misiing"})
        }
        if(!content){
            return res.status(405).json({error: "Content Misiing"})
        }
       
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
        if(!conversation){
            return res.status(404).json({message: "Conversation Not Found"})
         }

        const member = conversation.memberOne.profileid === profile.id ? conversation.memberOne : conversation.memberTwo

        if(!member){
            return res.status(404).json({message: "member Not Found"})
         }

         const message = await db.directMessage.create({
            data:{
                fileUrl,
                conversationId: conversationId as string,
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

         const channelKey = `chat:${conversationId}:messages`
         res?.socket?.server?.io?.emit(channelKey, message)

   return res.status(200).json(message)
    } catch (error) {
        console.log("MESSAGE_POST", error);
        return res.status(500).json({message: "Internal Error"})
    }

}