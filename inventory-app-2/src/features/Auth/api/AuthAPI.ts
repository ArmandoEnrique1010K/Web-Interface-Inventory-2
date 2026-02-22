import { api } from "@/lib/axiosConfig"
import type { AuthLoginForm } from "../types"
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
      console.log(data.message)
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
  }
}



// TODO: ELIMINAR, ES UNA PRUEBA ESTE MÉTODO
// export async function welcome() {
//   try {
//     const url = ``
//     const { data } = await api.get<string>(url)
//     return data
//   } catch (error) {
//     if (isAxiosError(error) && error.response) {
//       throw new Error(error.response.data.error)
//     }

//     console.log(error)
//   }
// }
