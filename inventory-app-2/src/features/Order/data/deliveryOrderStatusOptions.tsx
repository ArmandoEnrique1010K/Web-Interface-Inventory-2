import type { OrderStatusOptions } from "../schemas/items";

export const deliveryOrderStatusOptions: OrderStatusOptions = [
    { value: "ORDER_READY", label: "Listo" },
    { value: "ORDER_PENDING", label: "Pendiente" },
    { value: "ORDER_DELIVERED", label: "Entregado" },
    { value: "ORDER_CANCELED", label: "Eliminado" },
    { value: "ORDER_PARTIALLY_DELIVERED", label: "Parcialmente entregado" },
];
