import { z } from "zod"

export const userSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string(),
    dni: z.string(),
    password: z.string(),

    operator: z.boolean(),
    secretary: z.boolean(),
    admin: z.boolean(),
})

export type User = z.infer<typeof userSchema>

export type UserRegisterForm = User;
export type RolesForm = Pick<User, "operator" | "secretary" | "admin">;

