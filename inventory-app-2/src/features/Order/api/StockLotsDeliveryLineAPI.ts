import { api } from "@/lib/axiosConfig";
import type { DataResponse } from "@/types/index";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";
import type { StockLotDeliveryLineItem } from "../types";

export async function getStockLotsByDeliveryLine(
    idDeliveryLine: string,
): Promise<StockLotDeliveryLineItem[]> {
    try {
        const url = `/stock-lot-delivery-lines/delivery-line/${idDeliveryLine}`;
        const { data } = await api.get<DataResponse>(url);
        return data.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}
