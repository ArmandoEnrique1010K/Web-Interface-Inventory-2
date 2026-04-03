import { api } from "@/lib/axiosConfig";
import { handleApiError } from "@/utils/handleApiError";
import type { LocationForm } from "../schemas/requests";
import { responseSchema } from "@/types";
import {
    locationDetailResponseSchema,
    locationsListResponseSchema,
    locationsTopTenResponseSchema,
} from "../schemas/responses";

export async function registerLocation(formData: LocationForm) {
    try {
        const url = `/locations`;
        const { data } = await api.post(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
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
};

export async function listAllLocations(params: LocationQueryParams) {
    try {
        const url = `/locations`;
        const { data } = await api.get(url, { params: params });
        const parsed = locationsListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        handleApiError(error);
    }
}

export type ListFirstTenLocationByNameQueryParams = {
    name: string;
};

export async function listFirstTenLocationsByKeyword(
    params: ListFirstTenLocationByNameQueryParams,
    regionId: number,
    subregionId: number,
) {
    try {
        const url = `/locations/search/region/${regionId}/subregion/${subregionId}`;
        const { data } = await api.get(url, { params: params });
        const parsed = locationsTopTenResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function getLocation(id: number) {
    try {
        const url = `/locations/${id}`;
        const { data } = await api.get(url);
        const parsed = locationDetailResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        handleApiError(error);
    }
}

type UpdateLocationPayload = {
    locationId: number;
    formData: LocationForm;
};

export async function updateLocation({
    locationId,
    formData,
}: UpdateLocationPayload) {
    try {
        const url = `/locations/${locationId}`;
        const { data } = await api.put(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        handleApiError(error);
    }
}

export async function changeStatusLocation(locationId: number) {
    try {
        const url = `/locations/${locationId}/status`;
        const { data } = await api.patch(url);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        handleApiError(error);
    }
}
