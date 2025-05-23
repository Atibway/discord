import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Button } from "./ui/button"
import { Menu } from "lucide-react"
import { NavigationSidebar } from "./navigation/NavigationSidebar"
import { ServerSideBar } from "./server/ServerSideBar"
  

const MobileToggle = ({
    serverId
}:{
    serverId: string
}) => {
  return (
    <Sheet>
  <SheetTrigger asChild>
    <Button variant={"ghost"} size={"icon"} className="md:hidden">
        <Menu/>
    </Button>
  </SheetTrigger>
  <SheetContent side={"left"} className="p-0 flex gap-0">
   <div className="w-[72px]">
<NavigationSidebar/>
   </div>
   <ServerSideBar serverId={serverId}/>
  </SheetContent>
</Sheet>

  )
}

export default MobileToggle