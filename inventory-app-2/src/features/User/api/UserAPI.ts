import { api } from "@/lib/axiosConfig";
import { responseSchema } from "@/types";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";
import {
    userRolesDetailResponseSchema,
    usersPageListResponseSchema,
    usersTopTenResponseSchema,
} from "../schemas/response";
import type { RolesForm, UserRegisterForm } from "../schemas/requests";
import type { UserItem } from "../schemas/items";

export const registerUser = async (formData: UserRegisterForm) => {
    try {
        const url = `/users/register`;
        const { data } = await api.post(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
};

// LISTAR TODOS LOS USUARIOS
// QueryParams: page, name, idRoles

export type ListAllUsersQueryParams = {
    page?: number;
    name?: string;
    idRoles?: number[];
    role: UserItem["role"] | "";
};

export const listAllUsers = async (params: ListAllUsersQueryParams) => {
    try {
        const url = `/users`;
        const { data } = await api.get(url, { params });
        // console.log(params);

        const parsed = usersPageListResponseSchema.parse(data);
        console.log(parsed);
        return parsed.data;
    } catch (error) {
        console.log(error);
        throwApiErrorMessage(error);
    }
};

export type ListFirstTenUsersByKeywordQueryParams = {
    name: string;
};

export const listFirstTenUsersByKeyword = async (
    params: ListFirstTenUsersByKeywordQueryParams,
) => {
    try {
        const url = `/users/role/user`;
        const { data } = await api.get(url, { params });
        const parsed = usersTopTenResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
};

type UpdateUserRolesPayload = {
    userId: number;
    formData: RolesForm;
};

// TODO: CAMBIAR EL NOMBRE DE LA FUNCION EN EL BACKEND
export const getUserRoles = async (id: number) => {
    try {
        const url = `/users/${id}/roles`;
        const { data } = await api.get(url);
        const parsed = userRolesDetailResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
};

export const updateUserRoles = async ({
    userId,
    formData,
}: UpdateUserRolesPayload) => {
    try {
        const url = `/users/${userId}/roles`;
        const { data } = await api.put(url, formData);

        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
};

export async function changeStatusUser(userId: number) {
    try {
        const url = `/users/${userId}/status`;
        const { data } = await api.patch(url);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}
