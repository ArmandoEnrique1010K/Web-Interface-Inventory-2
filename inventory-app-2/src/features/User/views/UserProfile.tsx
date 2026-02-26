import { useQuery } from "@tanstack/react-query"
import { getUserProfile } from "../api/UserAPI"
import { Link } from "react-router-dom"

export const UserProfile = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['user-profile'],
        queryFn: getUserProfile
    })


    if (isLoading) {
        return <h1>Cargando...</h1>
    }

    return (
        // TODO: APLICAR UN DISEÑO DE LISTA AL PERFIL DEL USUARIO
        <div>
            <div >
                <h2 className="text-xl font-semibold">Información Personal</h2>
                <p>Nombre: {data?.firstname}</p>
                <p>Apellido: {data?.lastname}</p>
                <p>Email: {data?.email}</p>
                <p>DNI: {data?.dni}</p>
                <p>Roles: {data?.roles?.join(', ')}</p>
            </div>


            <Link to={'/profile/update'} className="bg-red-400">Actualizar Perfil</Link>
        </div>
    )
}

// RESPUESTA OBTENIDA DESDE LA API REST
// {
//     "type": "success",
//     "status": 200,
//     "data": {
//         "firstname": "Primer usuario",
//         "lastname": "del sistema",
//         "email": "enrique1010k@gmail.com",
//         "dni": 12345678,
//         "roles": [
//             "Administrador",
//             "Secretario",
//             "Operador",
//             "Usuario"
//         ]
//     }
// }


// EJEMPLO DE OBTENCION DE DATOS:
// <h1>{data?.data?.firstname}</h1>
// <h2>{data?.data?.lastname}</h2>
// <p>{data?.data?.email}</p>
// <p>{data?.data?.dni}</p>
// <p>{data?.data?.roles?.join(', ')}</p>
