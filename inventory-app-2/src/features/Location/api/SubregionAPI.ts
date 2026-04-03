import { api } from "@/lib/axiosConfig";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";
import type { SubregionForm } from "../schemas/requests";
import { responseSchema } from "@/types";
import {
    subregionDetailResponseSchema,
    subregionsListResponseSchema,
} from "../schemas/responses";

export async function registerSubregion(formData: SubregionForm) {
    try {
        const url = `/subregions`;
        const { data } = await api.post(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error: unknown) {
        throwApiErrorMessage(error);
    }
}

export async function listAllSubregionsByRegionId(regionId: number) {
    try {
        const url = `/subregions/region/${regionId}`;
        const { data } = await api.get(url);
        const parsed = subregionsListResponseSchema.parse(data);
        return parsed.data;
    } catch (error: unknown) {
        throwApiErrorMessage(error);
    }
}

export async function getSubregion(id: number) {
    try {
        const url = `/subregions/${id}`;
        const { data } = await api.get(url);
        const parsed = subregionDetailResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

type UpdateSubregionPayload = {
    subregionId: number;
    formData: SubregionForm;
};

export async function updateSubregion({
    subregionId,
    formData,
}: UpdateSubregionPayload) {
    try {
        const url = `/subregions/${subregionId}`;
        const { data } = await api.put(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}
