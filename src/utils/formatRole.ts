import type { RoleForUserProfileItem } from "@/features/Profile/schemas/item";

type Role = RoleForUserProfileItem["role"][number];

const rolesFormat: Record<Role, string> = {
    ROLE_USER: "Usuario",
    ROLE_OPERATOR: "Operador",
    ROLE_ADMIN: "Administrador",
};

export const formatRole = (role: Role) => {
    return rolesFormat[role];
};
