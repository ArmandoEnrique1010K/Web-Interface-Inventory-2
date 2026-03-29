import { api } from "@/lib/axiosConfig";
import type { DataPageResponse, DataResponse, GeneralResponse } from "@/types/index";
import { handleApiError } from "@/utils/handleApiError";
import type { LocationForm } from "../types";

export async function registerLocation(formData: LocationForm) {
    try {
        const url = `/locations`
        const { data } = await api.post<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error: unknown) {
        handleApiError(error);
    }
}

export type LocationQueryParams = {
    page?: number;
    name?: string;
    regionId?: string;
    subregionId?: string;
    status?: boolean;
}

export async function listAllLocations(params: LocationQueryParams) {
    try {
        const url = `/locations`
        const { data } = await api.get<DataPageResponse>(url, { params: params })
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

export type ListFirstTenLocationByNameQueryParams = {
    name: string
}

export async function listFirstTenLocationsByKeyword(params: ListFirstTenLocationByNameQueryParams, regionId: string, subregionId: string) {
    try {
        const url = `/locations/search/region/${regionId}/subregion/${subregionId}`
        const { data } = await api.get<DataResponse>(url, { params: params })
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function getLocation(id: string) {
    try {
        const url = `/locations/${id}`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

type UpdateLocationPayload = {
    locationId: string;
    formData: LocationForm;
}

export async function updateLocation({ locationId, formData }: UpdateLocationPayload) {
    try {
        const url = `/locations/${locationId}`
        const { data } = await api.put<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}

export async function changeStatusLocation(locationId: string) {
    try {
        const url = `/locations/${locationId}/status`
        const { data } = await api.patch<GeneralResponse>(url)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}
