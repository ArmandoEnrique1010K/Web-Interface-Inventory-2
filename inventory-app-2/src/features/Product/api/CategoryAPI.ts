
import { api } from "@/lib/axiosConfig"
import type { CategoryForm } from "../types"
import type { GeneralResponse } from "@/shared/types"
import { isAxiosError } from "axios"

export async function registerCategory(formData: CategoryForm) {
    try {
        const url = `/categories`
        const { data } = await api.post<GeneralResponse>(url, formData)
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
    }
}

export async function listAllCategories() {
    try {
        const url = `/categories`
        const { data } = await api.get<GeneralResponse>(url)
        if (data.type === 'success') {
            return data;
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
    }
}
