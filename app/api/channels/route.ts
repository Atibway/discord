import { currentProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";


export async function POST(
    req: Request,
    {params}: {params: {memberId: string}}
){
try {
    const profile = await currentProfile();
    const {searchParams} = new URL(req.url)
    const {name, type} = await req.json();

    const serverId = searchParams.get("serverId")

    if (!profile) {
        return new NextResponse("unauthorized", { status: 401 });
    }
    if (!serverId) {
        return new NextResponse("Server Id Missing", { status: 400 });
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
                    role:{
                        in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                    }
                }
            }
        },
        data:{
       Channel:{
        create:{
            profileid: profile.id as string,
            name,
            type,
        }
       }
        }
    })

    return NextResponse.json(serever);
} catch (error) {
    console.log(["CHANNEL_POST", error]);
    return new NextResponse("internal server error", { status: 500 });
}
}