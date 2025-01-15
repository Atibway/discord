
import {v4 as uuidV4} from "uuid";
import { currentProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function PATCH(
    req: Request,
    {params}: {params: {serverId: string}}
){
try {

    const profile = await currentProfile();

    if (!profile) {
        return new NextResponse("unauthorized", { status: 401 });
    }

    if (!params.serverId) {
        return new NextResponse("Server ID Mising", { status: 400 });
    }

    const serever = await db.server.update({
        where:{
            id: params.serverId,
            profileid: profile?.id
        },
        data:{
            inviteCode: uuidV4()
        }
    })

    return NextResponse.json(serever);
} catch (error) {
    console.log(["SERVER_ID", error]);
    return new NextResponse("internal server error", { status: 500 });
}
}
