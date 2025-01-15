import type { Metadata } from "next";
import {Open_Sans} from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

const font  = Open_Sans({subsets: ["latin"]})

export const metadata: Metadata = {
  title: 'discord',
  description: 'connect with people',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  return (
<SessionProvider session={session}>

    <html lang="en">
      <body
        className={cn(font.className,
          "bg-white, dark:bg-[#313338]")}
      >
      <ThemeProvider
         attribute="class"
         defaultTheme="dark"
         enableSystem
         disableTransitionOnChange
          >
<SocketProvider>
<ModalProvider/>
<QueryProvider>

<NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />

{children}
</QueryProvider>
</SocketProvider>   
      </ThemeProvider>
      </body>
    </html>
</SessionProvider>
  );
}
