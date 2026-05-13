import { createDataSchema } from "@/types";
import {
    adminDashboardItemSchema,
    operatorDashboardItemSchema,
    userDashboardItemSchema,
} from "./items";

export const userDashboardDetailResponseSchema = createDataSchema(
    userDashboardItemSchema,
);
export const operatorDashboardDetailResponseSchema = createDataSchema(
    operatorDashboardItemSchema,
);
export const adminDashboardDetailResponseSchema = createDataSchema(
    adminDashboardItemSchema,
);
