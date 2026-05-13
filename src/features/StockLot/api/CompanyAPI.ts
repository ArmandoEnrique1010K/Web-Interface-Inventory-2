import { api } from "@/lib/axiosConfig";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";
import type { CompanyForm } from "../schemas/requests";
import { responseSchema } from "@/types";
import {
    companiesListResponseSchema,
    companyDetailResponseSchema,
} from "../schemas/responses";

export async function registerCompany(formData: CompanyForm) {
    try {
        const url = `/companies`;
        const { data } = await api.post(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error: unknown) {
        throwApiErrorMessage(error);
    }
}

export async function listAllCompanies() {
    try {
        const url = `/companies`;
        const { data } = await api.get(url);
        const parsed = companiesListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function getCompany(id: number) {
    try {
        const url = `/companies/${id}`;
        const { data } = await api.get(url);
        const parsed = companyDetailResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

type UpdateCompanyPayload = {
    companyId: number;
    formData: CompanyForm;
};

export async function updateCompany({
    companyId,
    formData,
}: UpdateCompanyPayload) {
    try {
        const url = `/companies/${companyId}`;
        const { data } = await api.put(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}
