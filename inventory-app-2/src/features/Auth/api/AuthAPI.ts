import { api } from "@/lib/axiosConfig"
import type {
  AuthForgotUserPasswordForm, AuthLoginForm,
  AuthUpdateUserPasswordForm, AuthValidateUserTokenForm
} from "../types"
import type { GeneralResponse } from "types"
import { handleApiError } from "@/utils/handleApiError"

export async function login(formData: AuthLoginForm) {
  try {
    const url = `/auth/login`
    const { data } = await api.post<GeneralResponse>(url, formData)

    // SUCCESS
    // { 
    //   "type": "success", 
    //   "status": 200, 
    //   "message": "Has iniciado sesión con éxito" 
    // }
    if (data.type === 'success') {
      // redireccionar, guardar estado, etc.
      return data.message
    }
  } catch (error: unknown) {
    handleApiError(error);

    // if (isAxiosError(error) && error.response) {
    //   const err = error.response.data;

    //   if (!err) return

    //   // ❌ Errores por campo (fields)
    //   // { 
    //   //    "type": "error", 
    //   //    "status": 400, 
    //   //    "message": "Complete los campos faltantes", 
    //   //    "fields": { 
    //   //       "email": "El correo es obligatorio" 
    //   //    } 
    //   // }

    //   if (err.fields) {
    //     throw {
    //       type: 'FIELD_ERROR',
    //       message: err.message,
    //       fields: err.fields 
    //     }
    //   }
    //   // ❌ Error general (credenciales inválidas, etc.)
    //   // { 
    //   //   "type": "error", 
    //   //   "status": 400, 
    //   //   "message": "Las credenciales son inválidas, verifique su correo o contraseña" 
    //   // }
    //   if (err.message) {
    //     throw {
    //       type: 'GENERAL_ERROR',
    //       message: err.message
    //     }
    //   }
    // }

    // // ❌ Error general (cuando no hay conexión a la API)
    // throw {
    //   type: 'GENERAL_ERROR',
    //   message: 'Ocurrió un error inesperado'
    // }
  }
}

export async function forgotUserPassword(formData: AuthForgotUserPasswordForm) {
  try {
    const url = `/auth/forgot-password`
    const { data } = await api.post<GeneralResponse>(url, formData)

    if (data.type === 'success') {
      return {
        data: data.message,
        requestId: data.secretField
      }
    }
  } catch (error) {
    handleApiError(error);
  }
}

export async function validateUserToken(payload: {
  requestId: string,
  value: AuthValidateUserTokenForm['value']
}) {
  try {
    const url = `/auth/validate-token`
    const { data } = await api.post<GeneralResponse>(url, payload)

    if (data.type === 'success') {
      return {
        data: data.message!,
        resetToken: data.secretField!
      }
    }
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function updateUserPassword(payload: {
  resetToken: string,
  newPassword: AuthUpdateUserPasswordForm['newPassword'],
  confirmNewPassword: AuthUpdateUserPasswordForm['confirmNewPassword']
}) {
  try {
    const url = `/auth/change-password`
    const { data } = await api.put<GeneralResponse>(url, payload)

    if (data.type === 'success') {
      return data.message
    }
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function logout() {
  try {
    const url = `/auth/logout`
    const { data } = await api.post<GeneralResponse>(url)

    if (data.type === 'success') {
      return data.message
    }
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function currentSession() {
  try {
    const url = `/auth/current-session`
    const { data } = await api.get(url)

    if (data.type === 'success') {
      return data
    }
  } catch (error: unknown) {
    handleApiError(error);
  }
}
