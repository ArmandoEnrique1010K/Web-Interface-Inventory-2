import { api } from "@/lib/axiosConfig";
import { handleApiError } from "@/utils/handleApiError";
import type { ModelForm } from "../schemas/requests";
import { responseSchema } from "@/types";
import {
    modelDetailResponseSchema,
    modelsListResponseSchema,
    modelsPageResponseSchema,
    modelsSearchPageListResponseSchema,
    modelsTopTenResponseSchema,
} from "../schemas/responses";

type RegisterModelInProductPayload = {
    productId: number;
    data: ModelForm;
    file?: File;
};

export async function registerModelInProduct({
    productId,
    data,
    file,
}: RegisterModelInProductPayload) {
    // Configuracion para enviar los datos del formulario por separado: los datos y la imagen
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("entryDate", data.entryDate ?? "");
    formData.append("caducityDate", data.caducityDate ?? "");

    if (file) {
        formData.append("file", file);
    }

    try {
        const url = `/models/product/${productId}`;
        const { data } = await api.post(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        handleApiError(error);
    }
}

export async function listAllModelsByProductId(productId: number) {
    try {
        const url = `/models/product/${productId}`;
        const { data } = await api.get(url);
        const parsed = modelsListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        handleApiError(error);
    }
}

export type ModelQueryParams = {
    page?: number;
    keyword?: string;
    minStock?: string;
    maxStock?: string;
    minEntryDate?: string;
    maxEntryDate?: string;
    status?: boolean;
    categoryId?: string;
    typeId?: string;
};

export async function listAllModels(params: ModelQueryParams) {
    try {
        const url = `/models`;
        const { data } = await api.get(url, {
            params: params,
        });

        // Al utilizar data.data debe retornar lo siguiente
        //  data: {
        //    content: any[];
        //    page: number;
        //    size: number;
        //    totalElements: number;
        //    totalPages: number;
        //    first: boolean;
        //    last: boolean;
        // }

        const parsed = modelsPageResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        handleApiError(error);
    }
}

export type ListFirstTenModelsByKeywordParams = {
    keyword: string;
};

export async function listFirstTenModelsByKeyword(
    params: ListFirstTenModelsByKeywordParams,
) {
    try {
        const url = `/models/search/models`;
        const { data } = await api.get(url, { params });
        const parsed = modelsTopTenResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        handleApiError(error);
    }
}

export type ModelSearchQueryParams = {
    page?: number;
    keyword?: string;
};

export async function listActiveModelsByName(params: ModelSearchQueryParams) {
    try {
        const url = `/models/search`;
        const { data } = await api.get(url, {
            params,
        });
        const parsed = modelsSearchPageListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function getModel(id: number) {
    try {
        const url = `/models/${id}`;
        const { data } = await api.get(url);
        const parsed = modelDetailResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        handleApiError(error);
    }
}

type UpdateModelPayload = {
    modelId: number;
    data: ModelForm;
    file?: File;
};

export async function updateModel({ modelId, data, file }: UpdateModelPayload) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("entryDate", data.entryDate ?? "");
    formData.append("caducityDate", data.caducityDate ?? "");

    if (file) {
        formData.append("file", file);
    }

    try {
        const url = `/models/${modelId}`;
        const { data } = await api.put(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        handleApiError(error);
    }
}

export async function changeStatusModel(id: number) {
    try {
        const url = `/models/${id}/status`;
        const { data } = await api.patch(url);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        handleApiError(error);
    }
}
