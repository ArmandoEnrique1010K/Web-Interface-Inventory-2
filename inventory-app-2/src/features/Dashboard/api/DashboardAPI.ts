import { api } from "@/lib/axiosConfig";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";
import {
    adminDashboardDetailResponseSchema,
    operatorDashboardDetailResponseSchema,
    userDashboardDetailResponseSchema,
} from "../schemas/responses";

export async function getDashboardUser() {
    try {
        const url = `/dashboard/user`;
        const { data } = await api.get(url);
        const parsed = userDashboardDetailResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function getDashboardOperator() {
    try {
        const url = `/dashboard/operator`;
        const { data } = await api.get(url);
        const parsed = operatorDashboardDetailResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function getDashboardAdmin() {
    try {
        const url = `/dashboard/admin`;
        const { data } = await api.get(url);
        const parsed = adminDashboardDetailResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}
