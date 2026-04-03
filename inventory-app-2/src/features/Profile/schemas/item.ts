import { userSchema } from "@/features/User/schemas/entities";
import { z } from "zod";

export const userDetailsItemSchema = userSchema.pick({
    firstname: true,
    lastname: true,
    email: true,
    dni: true,
    roles: true,
});
export type UserDetailsItem = z.infer<typeof userDetailsItemSchema>;
