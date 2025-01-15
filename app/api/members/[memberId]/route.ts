
import { currentProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    {params}: {params: {memberId: string}}
){
try {
    const profile = await currentProfile();
    const {searchParams} = new URL(req.url)
    const {role} = await req.json();

    const serverId = searchParams.get("serverId")

    if (!profile) {
        return new NextResponse("unauthorized", { status: 401 });
    }
    if (!serverId) {
        return new NextResponse("Server Id Missing", { status: 400 });
    }
    if (!params.memberId) {
        return new NextResponse("Member Id Missing", { status: 400 });
    }


    const serever = await db.server.update({
        where:{
            id: serverId,
            profileid: profile.id
        },
        data:{
          members:{
            update:{
                where:{
                    id: params.memberId,
                    profileid:{
                        not: profile.id
                    }
                },
                data:{
                    role
                }
            }
          }
        },
        include:{
            members:{
                include:{
                    profile:true
                },
                orderBy:{
                    role:"asc"
                }
            }
        }
    })

    return NextResponse.json(serever);
} catch (error) {
    console.log(["MEMBERS-ID_PATCH", error]);
    return new NextResponse("internal server error", { status: 500 });
}
}
export async function DELETE(
    req: Request,
    {params}: {params: {memberId: string}}
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
    if (!params.memberId) {
        return new NextResponse("Member Id Missing", { status: 400 });
    }


    const serever = await db.server.update({
        where:{
            id: serverId,
            profileid: profile.id
        },
        data:{
            members:{
                deleteMany:{
                        id: params.memberId,
                        profileid:{
                            not: profile.id
                        }
                }
              }
        },
        include:{
            members:{
                include:{
                    profile:true
                },
                orderBy:{
                    role:"asc"
                }
            }
        }
    })

    return NextResponse.json(serever);
} catch (error) {
    console.log(["MEMBER-DELETE_PATCH", error]);
    return new NextResponse("internal server error", { status: 500 });
}
}
