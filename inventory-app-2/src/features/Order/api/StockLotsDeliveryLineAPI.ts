import { api } from "@/lib/axiosConfig";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";
import { stockLotsToDeliveryLineListResponseSchema } from "../schemas/responses";

export async function getStockLotsByDeliveryLine(idDeliveryLine: number) {
    try {
        const url = `/stock-lot-delivery-lines/delivery-line/${idDeliveryLine}`;
        const { data } = await api.get(url);
        const parsed = stockLotsToDeliveryLineListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}
