import { auth } from "@/auth";
import { NextApiRequest, NextApiResponse } from "next";

export const currentProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await auth(req, res);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user; 
};

export const currentRole = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await auth(req, res);

  if (!session?.user?.role) {
    throw new Error("Role not found");
  }

  return session.user.role; 
};
