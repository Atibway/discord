import { auth } from "@/auth";
import { db } from "./db";
import { redirect } from "next/navigation";
import { logout } from "@/actions/logout";

export const currentProfile = async ()=> {
    const session = await auth()


        const user = await db.user.findUnique({
            where: {
                id: session?.user.id
            }
        })
 
        if(!user){
            redirect("/login")
        }
  
    return user;
}
export const currentProfileInLogin = async ()=> {
    const session = await auth()

        // const user = await db.user.findUnique({
        //     where: {
        //         id: session?.user.id
        //     }
        // })

    return session?.user
}

export const currentRole = async ()=> {
    const session = await auth()

    return session?.user?.role;
}
