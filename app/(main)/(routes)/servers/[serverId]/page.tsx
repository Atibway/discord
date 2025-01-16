import { currentProfile } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

interface ServeridProps {
  params:{
    serverId: string
  }
}

const ServerIdPage = async({
  params
}:ServeridProps) => {
  const profile = await currentProfile()

  const server = await db.server.findUnique({
    where:{
      id: params.serverId,
      members:{
        some: {
          profileid: profile?.id,
        }
      }
    },
    include:{
      Channel:{
        where: {
          name: "general"
        }
      }
    }
  })

  const initialChannel = server?.Channel[0];

  if(initialChannel?.name !== "general"){
    return null
  }
  return redirect(`/servers/${params.serverId}/channels/${initialChannel.id}`)
}

export default ServerIdPage