import { z } from "zod";

import { roleSchema, userSchema } from "./entities";

export const userRegisterForm = userSchema
    .pick({
        firstname: true,
        lastname: true,
        email: true,
        dni: true,
        password: true,
    })
    .and(
        roleSchema.pick({
            // operator: true,
            // secretary: true,
            // admin: true,
            role: true,
        }),
    );

export const rolesForm = roleSchema.pick({
    // operator: true,
    // secretary: true,
    // admin: true,
    role: true,
});

export type UserRegisterForm = z.infer<typeof userRegisterForm>;
export type RolesForm = z.infer<typeof rolesForm>;
