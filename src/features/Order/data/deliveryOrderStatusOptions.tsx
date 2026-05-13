import type { OrderStatusOptions } from "../schemas/items";

export const deliveryOrderStatusOptions: OrderStatusOptions = [
    {
        value: "ORDER_READY",
        label: "Listo",
        color: "bg-gray-100 text-gray-700",
    },
    {
        value: "ORDER_PENDING",
        label: "Pendiente",
        color: "bg-blue-100 text-blue-700",
    },
    {
        value: "ORDER_DELIVERED",
        label: "Entregado",
        color: "bg-green-100 text-green-700",
    },
    {
        value: "ORDER_CANCELED",
        label: "Eliminado",
        color: "bg-red-100 text-red-700",
    },
    {
        value: "ORDER_PARTIALLY_DELIVERED",
        label: "Parcialmente entregado",
        color: "bg-blue-100 text-blue-700",
    },
];
