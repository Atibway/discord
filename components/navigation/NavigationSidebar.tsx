import { currentProfile } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'
import { NavigationActions } from './NavigationActions'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import { NavigationItem } from './NavigationItem'
import { ModeToggle } from '../modeToggler'
import { UserButton } from '../auth/user-button'

export const NavigationSidebar = async() => {
    const profile = await currentProfile()
    if(!profile){
        return redirect("/");
    }

    const server = await db.server.findMany({
        where:{
            members:{
                some:{
                    profileid: profile.id
        }
    }
        }
    })
  return (
    <div
    className='space-y-4 flex flex-col items-center h-full  bg-[#E3E5E8] w-full  dark:bg-[#1E1F22] py-3'
    >
        <NavigationActions/>
        <Separator className='h-[2px] bg-zinc-400 dark:bg-zinc-700 rounded-md w-10 mx-auto'/>
        <ScrollArea className='flex-1 w-full'>
           {server.map((server) => (
<div className='' key={server.id}>
<NavigationItem
id={server.id}
name={server.name}
imageUrl={server.imageUrl}
/>
</div>
           ))} 
        </ScrollArea>

        <div className='pb-3  mt-auto  flex items-center flex-col gap-y-4'>
            <ModeToggle/>
            <UserButton/>
        </div>
    </div>
  )
}
