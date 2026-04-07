import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
    secretToken: string;
    userRoles: string[];
    isAuthenticated: boolean;
    authChecked: boolean;
};

// Al recargar la pagina, redux vuelve los estados a sus valores inicales
const initialState: AuthState = {
    secretToken: "",
    userRoles: [],
    isAuthenticated: false,
    authChecked: false,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Actualiza el token secreto (solamente en formulairos para validar token de 6 digitos y formulario de cambio de contraseña)
        updateSecretToken: (state, action) => {
            state.secretToken = action.payload.secretToken;
        },

        // Establece que si hay un usuario autenticado
        setAuthenticated: (state) => {
            state.isAuthenticated = true;
        },

        // Establece los roles
        setUserRoles: (state, action: PayloadAction<string[]>) => {
            state.userRoles = action.payload;
        },

        // Limpia los datos del usuario autenticado
        clearAuth: (state) => {
            state.userRoles = [];
            state.isAuthenticated = false;
            state.authChecked = true;
        },

        // Verifica si cargo el usuario autenticado
        setAuthChecked: (state) => {
            state.authChecked = true;
        },
    },
});

export const {
    setAuthenticated,
    setUserRoles,
    clearAuth,
    setAuthChecked,
    updateSecretToken,
} = authSlice.actions;
export const authReducer = authSlice.reducer;
