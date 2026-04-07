import { userSchema } from "@/features/User/schemas/entities";
import { z } from "zod";

export const currentSessionSchema = userSchema.pick({
    firstname: true,
    lastname: true,
    email: true,
    dni: true,
    roles: true,
});

export type CurrentSessionItem = z.infer<typeof currentSessionSchema>;
