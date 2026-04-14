import type { RoleForUserProfileItem } from "@/features/Profile/schemas/item";

// SOLAMENTE SE EXTRAE EL TIPO DE UN ELEMENTO DEL ARREGLO
// type Role = ("Usuario" | "Operador" | "Secretario" | "Administrador")[]
type Role = RoleForUserProfileItem["roles"][number];

// EN lugar de un find se utiliza un objeto de tipo mapa: el key es Usuario, Operador, etc. y el valor es el estilo de tailwind
const rolesColors: Record<Role, string> = {
    Usuario: "bg-gray-100 text-gray-700",
    Operador: "bg-blue-100 text-blue-700",
    Secretario: "bg-emerald-100 text-emerald-700",
    Administrador: "bg-red-100 text-red-700",
};

export const handleApplyRoleStyle = (role: Role) => {
    return rolesColors[role];
};
