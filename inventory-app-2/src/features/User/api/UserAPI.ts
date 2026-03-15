
import { api } from "@/lib/axiosConfig";
import type { DataResponse, GeneralResponse } from "types";
import type { RolesForm, UserRegisterForm } from "../types";
import { handleApiError } from "@/utils/handleApiError";


export const registerUser = async (formData: UserRegisterForm) => {
    try {
        const url = `/users/register`
        const { data } = await api.post<GeneralResponse>(url, formData)

        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error)
    }
}

// LISTAR TODOS LOS USUARIOS
// QueryParams: page, name, idRoles

export type ListAllUsersQueryParams = {
    page?: number
    name?: string
    idRoles?: number[]
}

export const listAllUsers = async (params: ListAllUsersQueryParams) => {
    try {
        const url = `/users`
        const { data } = await api.get<DataResponse>(url, { params: params })

        return data.data
    } catch (error) {
        handleApiError(error)
    }
}

export type ListFirstTenUsersByKeywordQueryParams = {
    name: string
}

// TODO: ESTE ENDPOINT SE VA A UTILIZAR CUANDO SE CREE UNA ORDEN DE ENTREGA
export const listFirstTenUsersByKeyword = async (params: ListFirstTenUsersByKeywordQueryParams) => {

    try {
        const url = `/users/role/user`
        const { data } = await api.get<DataResponse>(url, { params: params })
        return data.data
    } catch (error) {
        handleApiError(error)
    }
}

type UpdateUserRolesPayload = {
    userId: string;
    formData: RolesForm
}


export const getUserRoles = async (id: string) => {
    try {
        const url = `/users/${id}/roles`
        const { data } = await api.get<DataResponse>(url)
        return data.data
    } catch (error) {
        handleApiError(error)
    }

}

export const updateUserRoles = async ({ userId, formData }: UpdateUserRolesPayload) => {
    try {
        const url = `/users/${userId}/roles`
        const { data } = await api.put<GeneralResponse>(url, formData)

        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error)
    }
}

export async function changeStatusUser(userId: string) {
    try {
        const url = `/users/${userId}/status`
        const { data } = await api.patch<GeneralResponse>(url)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}