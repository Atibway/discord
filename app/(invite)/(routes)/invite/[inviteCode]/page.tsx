import { currentProfile } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

interface InviteCodepageProps {
    params: {
        inviteCode: string
    }
}

const InviteCodepage = async({
    params
}: InviteCodepageProps) => {
    const profile = await currentProfile()

    if (!profile) {
        return redirect("/login")
    }

    if(!params.inviteCode){
        return redirect("/")
    }

const existingInvite = await db.server.findFirst({
    where: {
        inviteCode: params.inviteCode,
        members:{
            some:{
                profileid: profile.id
            }
        }
    }
})

if(existingInvite){
    return redirect(`/servers/${existingInvite.id}`)
}

const server = await db.server.update({
    where: {
        inviteCode: params.inviteCode
    },
    data: {
        members: {
            create: [
                {
                    profileid: profile?.id as string,
                }
            ]
        }
    }
})

if(server){
    return redirect(`/servers/${server.id}`)
}
  return null
}

export default InviteCodepage