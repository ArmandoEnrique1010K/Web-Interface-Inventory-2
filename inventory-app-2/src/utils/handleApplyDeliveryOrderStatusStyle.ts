import type { DeliveryOrderItem } from "@/features/Order/schemas/items";

type DeliveryOrderStatus = DeliveryOrderItem["orderStatus"][number];
// "ORDER_READY" | "ORDER_PENDING" | "ORDER_DELIVERED" | "ORDER_CANCELED" | "ORDER_PARTIALLY_DELIVERED"
const deliveryOrderColors: Record<DeliveryOrderStatus, string> = {
    ORDER_READY: "bg-gray-100 text-gray-700",
    ORDER_PENDING: "bg-blue-100 text-blue-700",
    ORDER_DELIVERED: "bg-green-100 text-green-700",
    ORDER_PARTIALLY_DELIVERED: "bg-blue-100 text-blue-700",
    ORDER_CANCELED: "bg-red-100 text-red-700",
};

export const handleApplyDeliveryOrderStatusStyle = (
    deliveryOrderStatus: DeliveryOrderStatus,
) => {
    return deliveryOrderColors[deliveryOrderStatus];
};

// const deliveryOrderStatusColors: { status: string; style: string }[] = [
//     {
//         status: "Listo",
//         style: "bg-gray-100 text-gray-700",
//     },
//     {
//         status: "Pendiente",
//         style: "bg-blue-100 text-blue-700",
//     },
//     {
//         status: "Entregado",
//         style: "bg-green-100 text-green-700",
//     },
//     {
//         status: "Eliminado",
//         style: "bg-red-100 text-red-700",
//     },
// ];

// export const handleApplyDeliveryOrderStatusStyle = (
//     status: "Listo" | "Pendiente" | "Entregado" | "Eliminado",
// ) => {
//     return `${deliveryOrderStatusColors.find((deliveryOrderStatusColor) => deliveryOrderStatusColor.status === status)?.style}`;
// };
