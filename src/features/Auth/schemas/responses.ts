import { createDataSchema, errorSchema } from "@/types";
import z from "zod";
import { currentSessionSchema } from "./item";

export const currentSessionToDataResponseSchema =
    createDataSchema(currentSessionSchema);

export const currentSessionResponseSchema = z.discriminatedUnion("type", [
    currentSessionToDataResponseSchema,
    errorSchema,
]);
