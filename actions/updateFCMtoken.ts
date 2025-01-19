"use server"
import { db } from "@/lib/db";

export const updateFcmTokenServer = async (profileId: string, serverId: string, token: string) => {
  try {
   
    // Check if the member exists and if the token has changed
    const member = await db.member.findFirst({
        where: {
          profileid: profileId,
          serverid: serverId,
        },
      });
  
      if (!member) {
        console.error("Member not found in the database.");
        return null;
      }
  
      
        
   const updatedUser =   await db.member.update({
          where: {
            id: member.id,
          },
          data: {
            FcmToken: token,
          },
        });
      
  
      return updatedUser;
  } catch (error) {
    console.log(error);
     return{error:"Failed to generate subscriber analytics data"};
  }
};
