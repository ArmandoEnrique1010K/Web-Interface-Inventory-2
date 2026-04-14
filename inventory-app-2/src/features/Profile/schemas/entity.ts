import z from "zod";

export const profileSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string(),
    dni: z.number(),
    roles: z.array(
        z.enum(["Administrador", "Secretario", "Operador", "Usuario"]),
    ),
});
