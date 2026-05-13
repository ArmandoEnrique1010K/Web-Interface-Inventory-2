import z from "zod";

export const profileSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string(),
    dni: z.number(),
    role: z.enum(["ROLE_USER", "ROLE_OPERATOR", "ROLE_ADMIN"]),
});
