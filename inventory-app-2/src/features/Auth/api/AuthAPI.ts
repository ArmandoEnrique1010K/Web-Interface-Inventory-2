import { api } from "@/lib/axiosConfig"
import type { AuthForgotUserPasswordForm, AuthLoginForm, AuthUpdateUserPasswordForm, AuthValidateUserTokenForm } from "../types"
import type { GeneralResponse } from "@/shared/types"
import { isAxiosError } from "axios"

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
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const err = error.response.data;

      if (!err) return

      // ❌ Errores por campo (fields)
      // { 
      //    "type": "error", 
      //    "status": 400, 
      //    "message": "Complete los campos faltantes", 
      //    "fields": { 
      //       "email": "El correo es obligatorio" 
      //    } 
      // }

      if (err.fields) {
        throw {
          type: 'FIELD_ERROR',
          message: err.message,
          fields: err.fields //* <--- Record<string, string>
        }
      }
      // ❌ Error general (credenciales inválidas, etc.)
      // { 
      //   "type": "error", 
      //   "status": 400, 
      //   "message": "Las credenciales son inválidas, verifique su correo o contraseña" 
      // }
      if (err.message) {
        throw {
          type: 'GENERAL_ERROR',
          message: err.message
        }
      }
    }

    // ❌ Error general (cuando no hay conexión a la API)
    throw {
      type: 'GENERAL_ERROR',
      message: 'Ocurrió un error inesperado'
    }
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
    if (isAxiosError(error) && error.response) {
      const err = error.response.data;
      if (!err) return

      if (err.fields) {
        throw {
          type: 'FIELD_ERROR',
          message: err.message,
          fields: err.fields
        }
      }

      if (err.message) {
        throw {
          type: 'GENERAL_ERROR',
          message: err.message
        }
      }
    }

    throw {
      type: 'GENERAL_ERROR',
      message: 'Ocurrió un error inesperado'
    }
  }
}

export async function validateUserToken(formData: AuthValidateUserTokenForm) {
  try {
    const url = `/auth/validate-token`
    const { data } = await api.post<GeneralResponse>(url, formData)

    if (data.type === 'success') {
      return {
        data: data.message!,
        resetToken: data.secretField!
      }
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const err = error.response.data;
      if (!err) return

      if (err.fields) {
        throw {
          type: 'FIELD_ERROR',
          message: err.message,
          fields: err.fields
        }
      }

      if (err.message) {
        throw {
          type: 'GENERAL_ERROR',
          message: err.message
        }
      }
    }

    throw {
      type: 'GENERAL_ERROR',
      message: 'Ocurrió un error inesperado'
    }
  }
}

export async function updateUserPassword(formData: AuthUpdateUserPasswordForm) {
  try {
    const url = `/auth/change-password`
    const { data } = await api.put<GeneralResponse>(url, formData)

    if (data.type === 'success') {
      return data.message
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const err = error.response.data;
      if (!err) return

      if (err.fields) {
        throw {
          type: 'FIELD_ERROR',
          message: err.message,
          fields: err.fields
        }
      }

      if (err.message) {
        throw {
          type: 'GENERAL_ERROR',
          message: err.message
        }
      }
    }

    throw {
      type: 'GENERAL_ERROR',
      message: 'Ocurrió un error inesperado'
    }
  }
}

export async function logout() {
  try {
    const url = `/auth/logout`
    const { data } = await api.post<GeneralResponse>(url)

    if (data.type === 'success') {
      return data.message
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const err = error.response.data;
      if (!err) return

      if (err.fields) {
        throw {
          type: 'FIELD_ERROR',
          message: err.message,
          fields: err.fields
        }
      }

      if (err.message) {
        throw {
          type: 'GENERAL_ERROR',
          message: err.message
        }
      }
    }

    throw {
      type: 'GENERAL_ERROR',
      message: 'Ocurrió un error inesperado'
    }
  }
}
