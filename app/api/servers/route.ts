
import {v4 as uuidV4} from "uuid";
import { currentProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request){
try {
    const {name, imageUrl} = await req.json();
    const profile = await currentProfile();

    if (!profile) {
        return new NextResponse("unauthorized", { status: 401 });
    }

    if (!profile.id) {
        return new NextResponse("profile id is undefined", { status: 400 });
    }

    const serever = await db.server.create({
       data:{
        profileid: profile.id,
        name,
        imageUrl,
        inviteCode: uuidV4(),
        Channel:{
            create:[
                {name: "general", profileid: profile.id},
            ]
        },
        members:{
            create: [
                {profileid: profile.id, role: MemberRole.ADMIN}
            ]
        }
       } 
    });

    return NextResponse.json(serever);
} catch (error) {
    console.log(["SERVER_POST", error]);
    return new NextResponse("internal server error", { status: 500 });
}
}
