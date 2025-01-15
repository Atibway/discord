import { useSession } from "next-auth/react";

export const useCurrentRole = ()=> {
    const Session = useSession();

    return Session.data?.user?.role
}