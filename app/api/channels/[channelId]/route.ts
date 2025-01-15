import { currentProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    {params}: {params: {channelId: string}}
){
try {
    const profile = await currentProfile();
    const {searchParams} = new URL(req.url)

    const serverId = searchParams.get("serverId")

    if (!profile) {
        return new NextResponse("unauthorized", { status: 401 });
    }
    if (!serverId) {
        return new NextResponse("Server Id Missing", { status: 400 });
    }
    if (!params.channelId) {
        return new NextResponse("Channel Id Missing", { status: 400 });
    }


    const serever = await db.server.update({
        where:{
            id: serverId,
            members:{
              some:{
                profileid: profile.id,
                role: {
                    in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                }
              }  
            }
        },
        data:{
            Channel:{
                delete:{
                        id: params.channelId,
                        name:{
                            not: "general"
                        }
                }
              }
        }
    })

    return NextResponse.json(serever);
} catch (error) {
    console.log("CHANNEL_ID_DELETE", error);
    return new NextResponse("internal server error", { status: 500 });
}
}
export async function PATCH(
    req: Request,
    {params}: {params: {channelId: string}}
){
try {
    const profile = await currentProfile();
    const {name, type} = await req.json()

    const {searchParams} = new URL(req.url)

    const serverId = searchParams.get("serverId")

    if (!profile) {
        return new NextResponse("unauthorized", { status: 401 });
    }
    if (!serverId) {
        return new NextResponse("Server Id Missing", { status: 400 });
    }
    if (!params.channelId) {
        return new NextResponse("Channel Id Missing", { status: 400 });
    }

    if (name === "general") {
        return new NextResponse("Name cannot be general", { status: 400 });
    }


    const serever = await db.server.update({
        where:{
            id: serverId,
            members:{
              some:{
                profileid: profile.id,
                role: {
                    in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                }
              }  
            }
        },
        data:{
            Channel:{
                update:{
                        where:{
                            id: params.channelId,
                        NOT:{
                            name: "general"
                        }
                        },
                        data:{
                            name,
                            type
                        }
                }
              }
        }
    })

    return NextResponse.json(serever);
} catch (error) {
    console.log("CHANNEL_ID_PATCH", error);
    return new NextResponse("internal server error", { status: 500 });
}
}