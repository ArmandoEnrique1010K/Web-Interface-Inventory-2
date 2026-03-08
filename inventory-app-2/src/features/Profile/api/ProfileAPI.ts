// OBTENER PERFIL DEL USUARIO

import { api } from "@/lib/axiosConfig";
import type { DataResponse, GeneralResponse } from "@/types/index";
import { isAxiosError } from "axios";
import type { UserProfileForm } from "../types";

export const getUserProfile = async () => {
    try {
        const url = `/users/profile`
        const { data } = await api.get<DataResponse>(url, {
            withCredentials: true
        })

        // console.log(data)
        return data.data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const err = error.response.data;

            if (!err) return

            if (err.fields) {
                throw {
                    type: 'FIELD_ERROR',
                    message: err.message,
                    fields: err.fields
                }
            }
            if (err.message) {
                throw {
                    type: 'GENERAL_ERROR',
                    message: err.message
                }
            }
        }

        throw {
            type: 'GENERAL_ERROR',
            message: 'Ocurrió un error inesperado'
        }
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
        if (isAxiosError(error) && error.response) {
            const err = error.response.data;

            if (!err) return

            if (err.fields) {
                throw {
                    type: 'FIELD_ERROR',
                    message: err.message,
                    fields: err.fields
                }
            }
            if (err.message) {
                throw {
                    type: 'GENERAL_ERROR',
                    message: err.message
                }
            }
        }
        throw {
            type: 'GENERAL_ERROR',
            message: 'Ocurrió un error inesperado'
        }
    }
}
