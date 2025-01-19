
import { currentProfile } from "@/lib/authOfPages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

import admin from "firebase-admin";
import { Message } from "firebase-admin/messaging";
import { NextRequest, NextResponse } from "next/server";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = require("@/service_key.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

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
        // if (typeof token !== 'string') {
        //     return res.status(400).json({ error: "Invalid token" });
        // }

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
 
         const link = `/servers/${message.member.serverid}/conversations/${message.member.id}`
         const memberToken = conversation.memberOne.profileid !== profile.id ? conversation.memberOne : conversation.memberTwo
         const token = memberToken.FcmToken as string
         const payload: Message = {
            token,
            notification: {
              title: memberToken.profile.name as string,
              body: message.content,
            },
            webpush: link ? {
              fcmOptions: {
                link,
              },
            } : undefined,
          };
await admin.messaging().send(payload);

         const channelKey = `chat:${conversationId}:messages`
         res?.socket?.server?.io?.emit(channelKey, message)

   return res.status(200).json(message)
    } catch (error) {
        console.log("MESSAGE_POST", error);
        return res.status(500).json({message: "Internal Error"})
    }

}