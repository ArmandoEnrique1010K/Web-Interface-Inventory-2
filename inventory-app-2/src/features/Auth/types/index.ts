import { z } from "zod"

export const loginSchema = z.object({
    email: z.string(),
    password: z.string(),
    value: z.string(),
    newPassword: z.string(),
    confirmNewPassword: z.string(),
})

type Auth = z.infer<typeof loginSchema>

export type AuthLoginForm = Pick<Auth, "email" | "password">;
export type AuthForgotUserPasswordForm = Pick<Auth, "email">;
export type AuthValidateUserTokenForm = Pick<Auth, "value">;
export type AuthUpdateUserPasswordForm = Pick<Auth, "newPassword" | "confirmNewPassword">;