
import { ServerSideBar } from "@/components/server/ServerSideBar"
import { currentProfile } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"



const ServerIdLayout = async({
    children,
    params
}:{children: React.ReactNode, params: {serverId: string}}
) => {
const user = await currentProfile()

const server = await db.server.findFirst({
where:{
  id: params.serverId,
  members:{
    some:{
      profileid: user?.id
    }
  }
}
})

if(!server){
    return redirect("/")
}


  return (
    <div className="" >
      <div className="hidden md:flex h-full w-60 z-20 flex-col  inset-y-0 fixed">
<ServerSideBar serverId={params.serverId}/>
      </div>
      <main className="min-h-screen md:pl-60">
    {children}  
      </main>
   </div>
  )
}
 


export default ServerIdLayout