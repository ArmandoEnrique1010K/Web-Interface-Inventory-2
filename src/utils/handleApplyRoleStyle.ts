import type { RoleForUserProfileItem } from "@/features/Profile/schemas/item";

// SOLAMENTE SE EXTRAE EL TIPO DE UN ELEMENTO DEL ARREGLO
// type Role = ("Usuario" | "Operador" | "Secretario" | "Administrador")[]
type Role = RoleForUserProfileItem["role"][number];

// EN lugar de un find se utiliza un objeto de tipo mapa: el key es Usuario, Operador, etc. y el valor es el estilo de tailwind
const rolesColors: Record<Role, string> = {
    ROLE_USER: "bg-gray-100 text-gray-700",
    ROLE_OPERATOR: "bg-blue-100 text-blue-700",
    ROLE_ADMIN: "bg-emerald-100 text-emerald-700",
};

export const handleApplyRoleStyle = (role: Role) => {
    return rolesColors[role];
};
