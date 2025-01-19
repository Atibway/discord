"use client"

import { updateFcmTokenServer } from "@/actions/updateFCMtoken";
import { fetchToken } from "@/firebase";
import { useEffect } from "react";

export const updateFcmToken = (profileId: string, serverId: string) => {
  useEffect(() => {
    const updateToken = async () => {
      try {
        const token = await fetchToken();
        const UpdatedMember = await updateFcmTokenServer(profileId, serverId, token as string);
        return UpdatedMember;
      } catch (error) {
        console.error("Error updating FCM token:", error);
        return null;
      }
    };

    updateToken();
  }, []);
};
