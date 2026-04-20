import { z } from "zod";
import { dashboardSchema } from "./entities";

export const userDashboardItemSchema = dashboardSchema.pick({
    pendingDeliveryOrdersByUserCount: true,
    pendingDeliveryOrdersByUser: true,
});

export const operatorDashboardItemSchema = dashboardSchema.pick({
    quantityDeliveryOrdersPending: true,
    quantityModelsActive: true,
    quantityLowStockModels: true,
    quantityNearCaducityDateModels: true,

    pendingDeliveryOrders: true,
    lowStockModels: true,
    recentModels: true,
    expiringSoonModels: true,
});

export const adminDashboardItemSchema = dashboardSchema.pick({
    quantityDeliveryOrdersPending: true,
    quantityModelsActive: true,
    quantityLowStockModels: true,
    quantityNearCaducityDateModels: true,
    quantityMovementsToday: true,

    pendingDeliveryOrders: true,
    lowStockModels: true,
    recentModels: true,
    expiringSoonModels: true,
    recentMovements: true,
});

export type UserDashboardItem = z.infer<typeof userDashboardItemSchema>;
export type OperatorDashboardItem = z.infer<typeof operatorDashboardItemSchema>;
export type AdminDashboardItem = z.infer<typeof adminDashboardItemSchema>;
