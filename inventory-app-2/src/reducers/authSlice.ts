import { createSlice } from "@reduxjs/toolkit"

type AuthState = {
    secretToken: string,
}

const initialState: AuthState = {
    secretToken: "",
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateSecretToken: (state, action) => {
            state.secretToken = action.payload.secretToken
        }
    }
})

export const { updateSecretToken } = authSlice.actions;
export const authReducer = authSlice.reducer;