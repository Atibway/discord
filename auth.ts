import NextAuth from "next-auth"
import authConfig from "./auth.config"
import {PrismaAdapter} from "@auth/prisma-adapter"
import { db } from "./lib/db"
import { getUserById } from "./data/user"

import { getAccountByUserId } from "./data/account"
import { MemberRole } from "@prisma/client"
export const {
  handlers, auth, signIn, signOut} = NextAuth({
    pages: {
signIn: '/login',
error: "/error"
    },
    events: {
async linkAccount({user}){
await db.user.update({
  where: {id: user.id},
  data:{
    emailVerified: new Date()
  }})}
    },
    callbacks: {
      async signIn({user,account}){
        if(account?.provider !== "credentials") return true
      const existingUser = await getUserById(user?.id)
      if(!existingUser?.emailVerified){
        return false
      }
     
      
        return true;
      },
      async session({session, token}){
if(token.sub && session.user){
session.user.id = token.sub;
}
if(token.role && session.user){
session.user.role = token.role as MemberRole
}
if(session.user){
session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
}
if(session.user){
session.user.name = token.name;
session.user.email = token.email as string
session.user.isOAuth = token.isOAuth as boolean
}
        return session
      },
async jwt({token}){

  if(!token.sub) return token;
  
  const existingUser = await getUserById(token.sub)
  if(!existingUser) return token;

  const existingAccount = await getAccountByUserId(existingUser.id);

  token.isOAuth = !!existingAccount;
  token.name = existingUser.name;
  token.email = existingUser.email
  token.role = existingUser.role

  return token
}
    },
      adapter: PrismaAdapter(db),
      session: {strategy: "jwt"},
  ...authConfig,
})