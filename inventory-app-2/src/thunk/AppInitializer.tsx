import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { loadUserSession } from "@/store/authThunks"
import type { AppDispatch } from "@/store/store"

export const AppInitializer = () => {
    const dispatch = useDispatch<AppDispatch>()

    // TODO: PROBAR UNA NUEVA SOLUCION, OBTENER EL JWT EN EL BACKEND Y SI EXISTE, DEVOLVER EL PERFIL DEL USUARIO, DE LO CONTRARIO DEVOLVER UN MENSAJE
    useEffect(() => {
        dispatch(loadUserSession())
    }, [dispatch])
    return null
}
