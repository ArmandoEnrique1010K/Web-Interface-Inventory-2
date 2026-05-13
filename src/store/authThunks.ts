import {
    clearAuth,
    setAuthChecked,
    setAuthenticated,
    setUserRoles,
} from "@/reducers/authSlice";
import type { AppDispatch } from "./store";
import { currentSession } from "@/features/Auth/api/AuthAPI";

// authThunks.ts
export const loadUserSession = () => async (dispatch: AppDispatch) => {
    try {
        const profile = await currentSession();

        /* Tipado de profile
        {
    email: string;
    firstname: string;
    lastname: string;
    dni: number;
    roles: ("Usuario" | "Operador" | "Secretario" | "Administrador")[];
}
        */
        dispatch(setAuthenticated());
        dispatch(setUserRoles(profile.role));
    } catch {
        dispatch(clearAuth());
    } finally {
        dispatch(setAuthChecked());
    }
};
