import { clearAuth, setAuthChecked, setAuthenticated, setUserRoles } from "@/reducers/authSlice"
import type { AppDispatch } from "./store"
import { currentSession } from "@/features/Auth/api/AuthAPI"

// authThunks.ts
export const loadUserSession = () => async (dispatch: AppDispatch) => {
    try {
        const profile = await currentSession()

        if (profile.data.message) {
            dispatch(clearAuth())
            return
        } else {
            dispatch(setAuthenticated())
            dispatch(setUserRoles(profile.roles))

        }

    } catch (error: any) {
        dispatch(clearAuth())
    } finally {
        dispatch(setAuthChecked())
    }
}