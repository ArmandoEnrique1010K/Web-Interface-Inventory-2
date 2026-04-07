// OBTENER PERFIL DEL USUARIO
import { api } from "@/lib/axiosConfig";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";
import { userProfileResponseSchema } from "../schemas/response";
import { responseSchema } from "@/types";
import type { UserDetailsItem } from "../schemas/item";

export const getUserProfilePage = async () => {
    try {
        const url = `/profile`;
        const { data } = await api.get(url);
        const parsed = userProfileResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
};
export const updateUserProfilePage = async (formData: UserDetailsItem) => {
    try {
        const url = `/profile`;
        const { data } = await api.put(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
};
