
import { api } from "@/lib/axiosConfig";
import type { DataResponse, GeneralResponse } from "types";
import { isAxiosError } from "axios";
import type { UserRegisterForm } from "../types";


export const registerUser = async (formData: UserRegisterForm) => {
    try {
        const url = `/users/register`
        const { data } = await api.post<GeneralResponse>(url, formData, {
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

// LISTAR TODOS LOS USUARIOS
// QueryParams: page, name, idRoles

export type ListAllUsersQueryParams = {
    page?: number
    name?: string
    idRoles?: number[]
}

export const listAllUsers = async (queryParams: ListAllUsersQueryParams) => {
    try {
        const url = `/users`
        const { data } = await api.get<DataResponse>(url, {
            withCredentials: true,
            params: queryParams
        })

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

// OBTENER PERFIL DEL USUARIO

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
