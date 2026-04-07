import { api } from "@/lib/axiosConfig";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";
import type {
    AuthForgotUserPasswordForm,
    AuthLoginForm,
    AuthUpdateUserPasswordForm,
    AuthValidateUserTokenForm,
} from "../schemas/requests";
import { responseSchema } from "@/types";
import { currentSessionResponseSchema } from "../schemas/responses";
import { AxiosError } from "axios";

export async function login(formData: AuthLoginForm) {
    try {
        const url = `/auth/login`;
        const { data } = await api.post(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error: unknown) {
        throwApiErrorMessage(error);
    }
}

export async function forgotUserPassword(formData: AuthForgotUserPasswordForm) {
    try {
        const url = `/auth/forgot-password`;
        const { data } = await api.post(url, formData);
        const parsed = responseSchema.parse(data);
        return {
            data: parsed.message,
            requestId: parsed.secretField,
        };
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function validateUserToken(payload: {
    requestId: string;
    value: AuthValidateUserTokenForm["value"];
}) {
    try {
        const url = `/auth/validate-token`;
        const { data } = await api.post(url, payload);
        const parsed = responseSchema.parse(data);
        return {
            data: parsed.message,
            resetToken: parsed.secretField,
        };
    } catch (error: unknown) {
        throwApiErrorMessage(error);
    }
}

export async function updateUserPassword(payload: {
    resetToken: string;
    newPassword: AuthUpdateUserPasswordForm["newPassword"];
    confirmNewPassword: AuthUpdateUserPasswordForm["confirmNewPassword"];
}) {
    try {
        const url = `/auth/change-password`;
        const { data } = await api.put(url, payload);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error: unknown) {
        throwApiErrorMessage(error);
    }
}

export async function logout() {
    try {
        const url = `/auth/logout`;
        const { data } = await api.post(url);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error: unknown) {
        throwApiErrorMessage(error);
    }
}

export async function currentSession() {
    try {
        const url = `/auth/current-session`;
        const { data } = await api.get(url);
        const parsed = currentSessionResponseSchema.parse(data);
        if (parsed.type === "error") {
            throw new Error(parsed.message);
        }
        return parsed.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
            throw error; // 🔥 importante
        }

        throwApiErrorMessage(error);
    }
}
