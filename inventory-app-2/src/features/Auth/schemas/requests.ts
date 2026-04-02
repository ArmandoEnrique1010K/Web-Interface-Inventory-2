import { z } from "zod";
import { loginSchema } from "./entities";

export const authLoginForm = loginSchema.pick({
    email: true,
    password: true,
});

export const authForgotUserPasswordForm = loginSchema.pick({
    email: true,
});

export const authValidateUserTokenForm = loginSchema.pick({
    value: true,
});

export const authUpdateUserPasswordForm = loginSchema.pick({
    newPassword: true,
    confirmNewPassword: true,
});

export type AuthLoginForm = z.infer<typeof authLoginForm>;
export type AuthForgotUserPasswordForm = z.infer<
    typeof authForgotUserPasswordForm
>;
export type AuthValidateUserTokenForm = z.infer<
    typeof authValidateUserTokenForm
>;
export type AuthUpdateUserPasswordForm = z.infer<
    typeof authUpdateUserPasswordForm
>;
