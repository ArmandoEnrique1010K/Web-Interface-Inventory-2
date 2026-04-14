import { z } from "zod";
import { profileSchema } from "./entity";

export const userDetailsItemSchema = profileSchema.pick({
    firstname: true,
    lastname: true,
    email: true,
    dni: true,
    roles: true,
});

export const roleForUserProfileSchema = userDetailsItemSchema.pick({
    roles: true,
});

export type UserDetailsItem = z.infer<typeof userDetailsItemSchema>;

export type RoleForUserProfileItem = z.infer<typeof roleForUserProfileSchema>;
