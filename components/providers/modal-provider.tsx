"use client"

import { useEffect, useState } from "react";
import { CreateServerModal } from "../modals/create-server-modal"
import { InviteModal } from "../modals/invite-modal";
import { EditServerModal } from "../modals/edit-server-modal";
import { MembersModal } from "../modals/members-modal";
import { CreateChannelModal } from "../modals/createChannelModal";
import { LeaveServerModal } from "../modals/leave-server-modal.tsx";
import { DeleteServerModal } from "../modals/delete-server-modal.tsx";
import { DeleteChannelModal } from "../modals/delete-Channel-modal";
import { EditChannelModal } from "../modals/edit-channel-modal";
import { MessageModal } from "../modals/message-file-modal";
import { DeleteMessageModal } from "../modals/delete-message-modal";

export const ModalProvider = ()=>{
    const [isMounted, setIsMounted] = useState(false);
    
      useEffect(() => {
        setIsMounted(true);
      }, []);
    


      if (!isMounted) {
        return null;
      }
    return (
        <>
        <CreateServerModal/>
        <InviteModal/>
        <EditServerModal/>
        <MembersModal/>
        <CreateChannelModal/>
        <LeaveServerModal/>
        <DeleteServerModal/>
        <DeleteChannelModal/>
        <EditChannelModal/>
        <MessageModal/>
        <DeleteMessageModal/>
        </>
    )
}