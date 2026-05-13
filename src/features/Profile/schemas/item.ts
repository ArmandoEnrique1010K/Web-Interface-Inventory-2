import { z } from "zod";
import { profileSchema } from "./entity";

export const userDetailsItemSchema = profileSchema.pick({
    firstname: true,
    lastname: true,
    email: true,
    dni: true,
    role: true,
});

export const roleForUserProfileSchema = userDetailsItemSchema.pick({
    role: true,
});

export type UserDetailsItem = z.infer<typeof userDetailsItemSchema>;

export type RoleForUserProfileItem = z.infer<typeof roleForUserProfileSchema>;
