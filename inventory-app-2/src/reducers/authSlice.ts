import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type AuthState = {
    secretToken: string,
    userRoles: string[],
    isAuthenticated: boolean,
    authChecked: boolean,
}

const initialState: AuthState = {
    secretToken: "",
    userRoles: [],
    isAuthenticated: false,
    authChecked: false
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateSecretToken: (state, action) => { state.secretToken = action.payload.secretToken },

        setAuthenticated: (state) => {
            state.isAuthenticated = true
        },

        setUserRoles: (state, action: PayloadAction<string[]>) => {
            state.userRoles = action.payload
        },

        clearAuth: (state) => {
            state.userRoles = []
            state.isAuthenticated = false
            state.authChecked = true
        },

        setAuthChecked: (state) => {
            state.authChecked = true
        },
    }
})

export const { setAuthenticated, setUserRoles, clearAuth, setAuthChecked, updateSecretToken } = authSlice.actions
export const authReducer = authSlice.reducer;