// OBTENER PERFIL DEL USUARIO
import { api } from "@/lib/axiosConfig";
import type { DataResponse, GeneralResponse } from "@/types/index";
import type { UserProfileForm } from "../types";
import { handleApiError } from "@/utils/handleApiError";

export const getUserProfile = async () => {
    try {
        const url = `/users/profile`
        const { data } = await api.get<DataResponse>(url, {
            withCredentials: true
        })

        return data.data

    } catch (error) {
        handleApiError(error)
    }
}
export const updateUserProfile = async (formData: UserProfileForm) => {
    try {
        const url = `/users/profile`
        const { data } = await api.put<GeneralResponse>(url, formData, {
            withCredentials: true
        })

        if (data.type === 'success') {
            return data.message
        }

    } catch (error) {
        handleApiError(error)
    }
}
