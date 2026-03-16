import { z } from "zod"

export const loginSchema = z.object({
    email: z.string(),
    password: z.string(),
    value: z.string(), // token de 6 digitos
    newPassword: z.string(),
    confirmNewPassword: z.string(),
    // resetToken: z.string(),
    // requestId: z.string()
})

type Auth = z.infer<typeof loginSchema>

export type AuthLoginForm = Pick<Auth, "email" | "password">;
export type AuthRestoreUserPasswordForm = Pick<Auth, "email">;
export type AuthValidateUserTokenForm = Pick<Auth, "value">;
export type AuthUpdateUserPasswordForm = Pick<Auth, "newPassword" | "confirmNewPassword">;