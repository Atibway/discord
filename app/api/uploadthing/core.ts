
import { currentProfile } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async()=> {
const user = await currentProfile()

if (!user?.id) throw new Error("Unauthorized");
const userId = user.id
return {userId};
}

export const ourFileRouter = {
  serverImage: f({image: {maxFileSize: "4MB", maxFileCount: 1}})
  .middleware(()=> handleAuth())
  .onUploadComplete(()=> {}),
  messageFile: f([ "image","pdf"])
  .middleware(()=> handleAuth())
  .onUploadComplete(()=> {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
