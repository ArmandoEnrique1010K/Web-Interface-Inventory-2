import type { LineStatusOptions } from "../schemas/items";

export const deliveryLineStatusOptions: LineStatusOptions = [
    {
        value: "LINE_MISSING",
        label: "Perdido",
        color: "bg-gray-100 text-gray-700",
    },
    {
        value: "LINE_READY",
        label: "Listo",
        color: "bg-green-100 text-green-700",
    },
    {
        value: "LINE_PENDING",
        label: "Pendiente",
        color: "bg-blue-100 text-blue-700",
    },
    {
        value: "LINE_DELIVERED",
        label: "Entregado",
        color: "bg-green-100 text-green-700",
    },
    {
        value: "LINE_CANCELED",
        label: "Eliminado",
        color: "bg-red-100 text-red-700",
    },
    {
        value: "LINE_EXCEEDED",
        label: "Excedido",
        color: "bg-blue-100 text-blue-700",
    },
];
