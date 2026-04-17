import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const rolePriority: Record<string, number> = {
    ROLE_USER: 1,
    ROLE_OPERATOR: 2,
    ROLE_ADMIN: 3,
};

export const useAuthRole = () => {
    const userRole = useSelector((state: RootState) => state.auth.userRole);
    const hasPermission = (requiredRole: string) => {
        if (!userRole) return false;

        return rolePriority[userRole] >= rolePriority[requiredRole];
    };

    const is = (role: string) => userRole === role;

    const isAdmin = () => userRole === "ROLE_ADMIN";

    const isOperatorOrHigher = () =>
        rolePriority[userRole] >= rolePriority["ROLE_OPERATOR"];

    return {
        userRole,
        hasPermission,
        is,
        isAdmin,
        isOperatorOrHigher,
    };
};
