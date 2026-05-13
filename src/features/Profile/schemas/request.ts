import { userSchema } from "@/features/User/schemas/entities";
import { z } from "zod";

export const profileForm = userSchema.pick({
    firstname: true,
    lastname: true,
    email: true,
    dni: true,
});
export type ProfileForm = z.infer<typeof profileForm>;
