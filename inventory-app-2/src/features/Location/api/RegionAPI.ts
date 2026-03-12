import type { DataResponse, GeneralResponse } from "@/types/index";
import { api } from "@/lib/axiosConfig";
import { handleApiError } from "@/utils/handleApiError";
import type { RegionForm } from "../types";

export async function registerRegion(formData: RegionForm) {
    try {
        const url = `/regions`
        const { data } = await api.post<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error: unknown) {
        handleApiError(error);
    }
}

export async function listAllRegions() {
    try {
        const url = `/regions`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function getRegion(id: string) {
    try {
        const url = `/regions/${id}`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

type UpdateCategoryPayload = {
    regionId: string;
    formData: RegionForm;
}

export async function updateRegion({ regionId, formData }: UpdateCategoryPayload) {
    try {
        const url = `/regions/${regionId}`
        const { data } = await api.put<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}