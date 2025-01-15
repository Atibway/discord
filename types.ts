import {Server as NetServer, Socket} from "net"
import {NextApiResponse} from "next"
import {Server as SocketIOServer} from "socket.io"

import { Channel, Member, Server, User } from "@prisma/client";


export type ServerWithMembersWithProfiles = Server & {
    Channel: Channel[];
    members: (Member & { profile: User })[];
}

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer
        }
    }
}