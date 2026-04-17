import { z } from "zod";

import { roleSchema, userSchema } from "./entities";

export const roleItemSchema = roleSchema.pick({
    label: true,
});

export const userItemSchema = userSchema.pick({
    id: true,
    firstname: true,
    lastname: true,
    dni: true,
    status: true,
    role: true,
});

export const userByKeywordItemSchema = userSchema.pick({
    id: true,
    fullName: true,
    email: true,
    dni: true,
});

export const userRolesDetailsSchema = roleSchema.pick({
    // operator: true,
    // secretary: true,
    // admin: true,
    role: true,
});

export type RoleItem = z.infer<typeof roleItemSchema>;
export type UserItem = z.infer<typeof userItemSchema>;
export type UserRolesDetails = z.infer<typeof userRolesDetailsSchema>;
export type UserByKeywordItem = z.infer<typeof userByKeywordItemSchema>;
