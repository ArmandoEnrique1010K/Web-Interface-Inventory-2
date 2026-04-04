import { api } from "@/lib/axiosConfig";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";
import type { MovementItem } from "../schemas/items";
import {
    movementDetailResponseSchema,
    movementsPageListResponseSchema,
} from "../schemas/responses";

export type LocationQueryParams = {
    page?: number;
    minQuantity?: string;
    maxQuantity?: string;
    minCreatedAt?: string;
    maxCreatedAt?: string;
    movementType?: MovementItem["movementType"];
    deliveryLineId?: string;
    username?: string; // Nombre de usuario
    keyword?: string; // Nombre de producto o modelo
    modelId?: string;
    userId?: string; // Id de usuario
    stockLotReceiverId?: string; // Lote de stock receptor
};

export async function listAllMovements(params: LocationQueryParams) {
    try {
        const url = `/movements`;
        const { data } = await api.get(url, {
            params: params,
        });
        const parsed = movementsPageListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function getMovement(id: string) {
    try {
        const url = `/movements/${id}`;
        const { data } = await api.get(url);
        const parsed = movementDetailResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}
