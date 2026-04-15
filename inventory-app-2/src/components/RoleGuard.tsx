import type { RootState } from "@/store/store";
import { hasPermission } from "@/utils/hasPermission";
import { useSelector } from "react-redux";

type CanProps = {
    requiredRole: string;
    children: React.ReactNode;
};

// Componente reutilizable para mostrar un contenido si el usuario que ha iniciado sesion tiene el rol mencionado
export const RoleGuard = ({ requiredRole, children }: CanProps) => {
    const { userRole } = useSelector((state: RootState) => state.auth);

    if (!hasPermission(userRole, requiredRole)) return null;
    return <>{children}</>;
};
