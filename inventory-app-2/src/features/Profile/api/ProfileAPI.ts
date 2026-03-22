// OBTENER PERFIL DEL USUARIO
import { api } from "@/lib/axiosConfig";
import type { DataResponse, GeneralResponse } from "@/types/index";
import type { UserProfilePageForm } from "../types";
import { handleApiError } from "@/utils/handleApiError";

export const getUserProfilePage = async () => {
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
export const updateUserProfilePage = async (formData: UserProfilePageForm) => {
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
