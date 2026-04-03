import { api } from "@/lib/axiosConfig";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";
import { rolesListResponseSchema } from "../schemas/response";

export async function listAllRoles() {
    try {
        const url = `/roles`;
        const { data } = await api.get(url);
        const parsed = rolesListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}
