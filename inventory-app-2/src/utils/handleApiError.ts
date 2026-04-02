import { isAxiosError } from "axios";

export function handleApiError(error: unknown): never {
    if (isAxiosError(error) && error.response!.data) {
        const err = error.response!.data;

        if (err?.fields) {
            throw { type: 'FIELD_ERROR', message: err.message, fields: err.fields };
        }

        if (err?.message) {
            throw { type: 'GENERAL_ERROR', message: err.message };
        }
    }

    throw { type: 'GENERAL_ERROR', message: 'Error inesperado o conexión interrumpida' };
}
