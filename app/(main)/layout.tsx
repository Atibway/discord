import { NavigationSidebar } from "@/components/navigation/NavigationSidebar"
import { currentProfile } from "@/lib/auth"
import { redirect } from "next/navigation"



const MainLayout = async({
    children
}:{children: React.ReactNode}
) => {
const user = await currentProfile()
if(!user){
    return redirect("/login")
  }
  return (
    <div className="h-full" >
        <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
<NavigationSidebar/>
        </div>
        <main className="md:pl-[72px] h-full ">
    {children}
        </main>
   </div>
  )
}
 


export default MainLayout