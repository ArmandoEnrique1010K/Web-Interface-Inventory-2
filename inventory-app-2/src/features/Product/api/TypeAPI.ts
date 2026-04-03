import { api } from "@/lib/axiosConfig";
import { responseSchema } from "@/types";
import { handleApiError } from "@/utils/handleApiError";
import type { TypeForm } from "../schemas/requests";
import {
    typeDetailResponseSchema,
    typesListResponseSchema,
} from "../schemas/responses";

export async function registerType(formData: TypeForm) {
    try {
        const url = `/types`;
        const { data } = await api.post(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error: unknown) {
        handleApiError(error);
    }
}

export async function listAllTypes() {
    try {
        const url = `/types`;
        const { data } = await api.get(url);
        const parsed = typesListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function getType(id: number) {
    try {
        const url = `/types/${id}`;
        const { data } = await api.get(url);
        const parsed = typeDetailResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function listAllActiveTypes() {
    try {
        const url = `/types/active`;
        const { data } = await api.get(url);
        const parsed = typesListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        handleApiError(error);
    }
}

type UpdateTypePayload = {
    typeId: number;
    formData: TypeForm;
};

export async function updateType({ typeId, formData }: UpdateTypePayload) {
    try {
        const url = `/types/${typeId}`;
        const { data } = await api.put(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        handleApiError(error);
    }
}

export async function changeStatusType(typeId: number) {
    try {
        const url = `/types/${typeId}/status`;
        const { data } = await api.patch(url);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        handleApiError(error);
    }
}
