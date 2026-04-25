import type { DeliveryOrderItem } from "../schemas/items";

export type OrderOnTimeStatusOptions = {
    value: DeliveryOrderItem["onTimeStatus"];
    label: string;
    color?: string;
}[];

export const deliveryOrderOnTimeStatusOptions: OrderOnTimeStatusOptions = [
    {
        value: "UNKNOWN",
        label: "Desconocido",
        color: "bg-gray-100 text-gray-700",
    },
    {
        value: "ON_TIME",
        label: "A tiempo",
        color: "bg-green-100 text-green-700",
    },
    {
        value: "LATE",
        label: "Con retraso",
        color: "bg-red-100 text-red-700",
    },
];
