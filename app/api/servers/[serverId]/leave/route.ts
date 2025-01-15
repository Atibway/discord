import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { currentProfile } from '@/lib/auth'

export async function PATCH(request: Request, { params }: { params: { serverId: string } }) {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const serverId = params.serverId

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileid: profile.id
          }
        }
      }
    })

    if (!server) {
      return NextResponse.json({ error: 'Server not found or you are not a member' }, { status: 404 })
    }

    await db.server.update({
      where: {
        id: serverId
      },
      data: {
        members: {
          deleteMany: {
            profileid: profile.id
          }
        }
      }
    })

    return NextResponse.json({ message: 'Successfully left the server' }, { status: 200 })
  } catch (error) {
    console.error('Error leaving server:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
