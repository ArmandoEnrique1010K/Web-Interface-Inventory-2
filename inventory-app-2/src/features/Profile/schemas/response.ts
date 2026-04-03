import { createDataSchema } from "@/types";
import { userDetailsItemSchema } from "./item";

export const userProfileResponseSchema = createDataSchema(
    userDetailsItemSchema,
);
