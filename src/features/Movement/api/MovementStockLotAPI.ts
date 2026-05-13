import { api } from "@/lib/axiosConfig";
import { movementStockLotListResponseSchema } from "../schemas/responses";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";

export async function listAllMovement_StockLotsByMovement(id: number) {
    try {
        const url = `/movement-stocklots/${id}`;
        const { data } = await api.get(url);
        const parsed = movementStockLotListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}
