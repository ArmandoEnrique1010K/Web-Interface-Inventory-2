import { z } from "zod";

export const loginSchema = z.object({
    email: z.string(),
    password: z.string(),
    value: z.string(), // token de 6 digitos
    newPassword: z.string(),
    confirmNewPassword: z.string(),
    // resetToken: z.string(),
    // requestId: z.string()
});
