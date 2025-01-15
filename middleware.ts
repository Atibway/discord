

import NextAuth from "next-auth";
import authConfig from "./auth.config";


export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  
  return ;
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
