import { api } from "@/lib/axiosConfig";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";
import type { RegionForm } from "../schemas/requests";
import { responseSchema } from "@/types";
import {
    regionDetailResponseSchema,
    regionsListResponseSchema,
} from "../schemas/responses";

export async function registerRegion(formData: RegionForm) {
    try {
        const url = `/regions`;
        const { data } = await api.post(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error: unknown) {
        throwApiErrorMessage(error);
    }
}

export async function listAllRegions() {
    try {
        const url = `/regions`;
        const { data } = await api.get(url);
        const parsed = regionsListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function getRegion(id: number) {
    try {
        const url = `/regions/${id}`;
        const { data } = await api.get(url);
        const parsed = regionDetailResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

type UpdateRegionPayload = {
    regionId: number;
    formData: RegionForm;
};

export async function updateRegion({
    regionId,
    formData,
}: UpdateRegionPayload) {
    try {
        const url = `/regions/${regionId}`;
        const { data } = await api.put(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function listAllRegionsByDeliveryOrder(deliveryOrderId: number) {
    try {
        const url = `/regions/deliveryOrder/${deliveryOrderId}`;
        const { data } = await api.get(url);
        const parsed = regionsListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}
