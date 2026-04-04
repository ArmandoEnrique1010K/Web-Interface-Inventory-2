import type { DeliveryLineItem } from "@/features/Order/schemas/items";

type DeliveryLineStatus = DeliveryLineItem["lineStatus"][number];
// "LINE_MISSING" | "LINE_READY" | "LINE_PENDING" | "LINE_DELIVERED" | "LINE_CANCELED" | "LINE_EXCEEDED"
const deliveryLineColors: Record<DeliveryLineStatus, string> = {
    LINE_MISSING: "bg-gray-100 text-gray-700",
    LINE_READY: "bg-green-100 text-green-700",
    LINE_PENDING: "bg-blue-100 text-blue-700",
    LINE_DELIVERED: "bg-green-100 text-green-700",
    LINE_CANCELED: "bg-red-100 text-red-700",
    LINE_EXCEEDED: "bg-blue-100 text-blue-700",
};

export const handleApplyDeliveryLineStatusStyle = (
    deliveryLineStatus: DeliveryLineStatus,
) => {
    return deliveryLineColors[deliveryLineStatus];
};
