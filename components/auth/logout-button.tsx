"use client"
import { logout } from "../../actions/logout";
import { redirect } from "next/navigation";

interface LogoutButtonProps {
    children?: React.ReactNode;
}

export const LogoutButton = ({
    children
}: LogoutButtonProps)=> {
const onClick = ()=> {
    logout()
redirect("/login")
};

return (
    <span onClick={onClick} className="curser-pointer">
        {children}
    </span>
)
}