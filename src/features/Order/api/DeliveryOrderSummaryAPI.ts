import { api } from "@/lib/axiosConfig";
import { deliveryOrderSummaryResponseSchema } from "../schemas/responses";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";

export async function getSummaryByDeliveryOrder(id: number) {
    try {
        const url = `/summary/${id}`;
        const { data } = await api.get(url);
        const parsed = deliveryOrderSummaryResponseSchema.parse(data);
        console.log(parsed);
        return parsed.data;
    } catch (error) {
        console.log(error);
        throwApiErrorMessage(error);
    }
}
