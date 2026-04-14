import { z } from "zod";

export const sessionSchema = z.object({
    email: z.string(),
    roles: z.array(
        z.enum(["ROLE_USER", "ROLE_OPERATOR", "ROLE_SECRETARY", "ROLE_ADMIN"]),
    ),
});

export const userSchema = z.object({
    id: z.number(),
    firstname: z.string(),
    lastname: z.string(),
    fullName: z.string(), // Nombre y apellidos en un solo campo
    email: z.string(),
    dni: z.number(),
    password: z.string(),
    roles: z.array(
        z.enum(["Usuario", "Operador", "Secretario", "Administrador"]),
    ),
    status: z.boolean(),
});

export const roleSchema = z.object({
    id: z.number(),
    label: z.string(),

    operator: z.boolean(),
    secretary: z.boolean(),
    admin: z.boolean(),
});
