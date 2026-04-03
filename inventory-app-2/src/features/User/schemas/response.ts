import {
    createDataListSchema,
    createDataSchema,
    createPageDataListSchema,
} from "@/types";
import {
    roleItemSchema,
    userByKeywordItemSchema,
    userItemSchema,
    userRolesDetailsSchema,
} from "./items";

// PAGINA DE USUARIOS
export const usersPageListResponseSchema =
    createPageDataListSchema(userItemSchema);

// PRIMEROS 10 USUARIOS
export const usersTopTenResponseSchema = createDataListSchema(
    userByKeywordItemSchema,
);

// ROLES DE UN SOLO USUARIO
export const userRolesDetailResponseSchema = createDataSchema(
    userRolesDetailsSchema,
);

// LISTA DE ROLES
export const rolesListResponseSchema = createDataListSchema(roleItemSchema);
