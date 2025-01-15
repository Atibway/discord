import { redirect } from "next/navigation"
import { getUserById } from "@/data/user"
import { currentProfile } from "./auth"


export const initialProfile =async ()=> {
    const user = await currentProfile()

    if(!user) {
        return redirect("/login")
    }
    const profile = await getUserById(user.id)

    if(profile){
        return profile  
      }else{
        return redirect("/login")
      }
}

