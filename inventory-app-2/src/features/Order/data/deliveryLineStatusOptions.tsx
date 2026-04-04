import type { LineStatusOptions } from "../schemas/items";

export const deliveryLineStatusOptions: LineStatusOptions = [
    { value: "LINE_MISSING", label: "Perdido" },
    { value: "LINE_READY", label: "Listo" },
    { value: "LINE_PENDING", label: "Pendiente" },
    { value: "LINE_DELIVERED", label: "Entregado" },
    { value: "LINE_CANCELED", label: "Eliminado" },
    { value: "LINE_EXCEEDED", label: "Excedido" },
];
