import { sessionSchema } from "@/features/User/schemas/entities";
import { z } from "zod";

export const currentSessionSchema = sessionSchema.pick({
    email: true,
    role: true,
});

export type CurrentSessionItem = z.infer<typeof currentSessionSchema>;
