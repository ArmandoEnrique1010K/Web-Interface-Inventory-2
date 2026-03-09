import { api } from "@/lib/axiosConfig"
import type { CompanyForm } from "../types"
import type { DataResponse, GeneralResponse } from "types"
import { handleApiError } from "@/utils/handleApiError"

export async function registerCompany(formData: CompanyForm) {
    try {
        const url = `/companies`
        const { data } = await api.post<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error: unknown) {
        handleApiError(error);
    }
}

export async function listAllCompanies() {
    try {
        const url = `/companies`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function getCompany(id: string) {
    try {
        const url = `/companies/${id}`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

type UpdateCompanyPayload = {
    companyId: string;
    formData: CompanyForm;
}

export async function updateCompany({ companyId, formData }: UpdateCompanyPayload) {
    try {
        const url = `/companies/${companyId}`
        const { data } = await api.put<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}