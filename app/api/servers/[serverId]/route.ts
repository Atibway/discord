
import { currentProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    {params}: {params: {serverId: string}}
){
try {
    const profile = await currentProfile();

    if (!profile) {
        return new NextResponse("unauthorized", { status: 401 });
    }

    const serever = await db.server.delete({
        where:{
            id: params.serverId,
            profileid: profile.id
        }
    })

    return NextResponse.json(serever);
} catch (error) {
    console.log(["SERVER_DELETE", error]);
    return new NextResponse("internal server error", { status: 500 });
}
}
export async function PATCH(
    req: Request,
    {params}: {params: {serverId: string}}
){
try {
    const {name, imageUrl} = await req.json();
    const profile = await currentProfile();

    if (!profile) {
        return new NextResponse("unauthorized", { status: 401 });
    }


    const serever = await db.server.update({
        where:{
            id: params.serverId,
            profileid: profile.id
        },
        data:{
           name,
           imageUrl
        }
    })

    return NextResponse.json(serever);
} catch (error) {
    console.log(["SERVER_PATCH", error]);
    return new NextResponse("internal server error", { status: 500 });
}
}
