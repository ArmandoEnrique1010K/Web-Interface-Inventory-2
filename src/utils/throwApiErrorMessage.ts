import { errorResponseSchema } from "@/types";
import { isAxiosError } from "axios";

export function throwApiErrorMessage(error: unknown): never {
    if (isAxiosError(error) && error.response?.data) {
        const parsed = errorResponseSchema.safeParse(error.response.data);

        if (parsed.success) {
            const err = parsed.data;

            if (err.fields) {
                throw {
                    type: "FIELD_ERROR",
                    message: err.message,
                    fields: err.fields,
                };
            }

            throw {
                type: "GENERAL_ERROR",
                message: err.message,
            };
        }
    }

    throw {
        type: "GENERAL_ERROR",
        message: "Error inesperado o conexión interrumpida",
    };
}
