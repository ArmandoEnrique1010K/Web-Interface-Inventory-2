import { z } from "zod"

export const userSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string(),
    dni: z.number(),
    password: z.string(),

    operator: z.boolean(),
    secretary: z.boolean(),
    admin: z.boolean(),
})

type User = z.infer<typeof userSchema>

export type UserRegisterForm = User;
export type UserProfileForm = Pick<User, "firstname" | "lastname" | "email" | "dni">;
export type RolesForm = Pick<User, "operator" | "secretary" | "admin">;

