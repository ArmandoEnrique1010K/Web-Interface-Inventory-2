import { useQuery } from "@tanstack/react-query"
import { getUserProfile } from "../api/UserAPI"
import { TitleContainer } from "@/components/TitleContainer"
import { ButtonLink } from "@/ui/ButtonLink"

const rolesColors: { role: string; style: string }[] = [
    {
        role: 'Usuario',
        style: 'bg-blue-500'
    },
    {
        role: 'Operador',
        style: 'bg-yellow-500'
    },
    {
        role: 'Secretario',
        style: 'bg-green-500'
    },
    {
        role: 'Administrador',
        style: 'bg-red-500'
    }
]

export const UserProfile = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['user-profile'],
        queryFn: getUserProfile
    })


    if (isLoading) {
        return <h1>Cargando...</h1>
    }

    return (

        <TitleContainer
            title={"Perfil del usuario"}
            buttons={
                <ButtonLink to={'/profile/update'} size={"large"} text={"Actualizar Perfil"} color={"blue"} />
            }
        >
            <div className="w-full border-blue-600 border-2">
                <div className="flex flex-row  bg-white border border-blue-600">
                    <div className="font-semibold bg-blue-500 text-white p-2 w-30">Nombre</div>
                    <div className="p-2">{data?.firstname}</div>
                </div>
                <div className="flex flex-row  bg-white border border-blue-600">
                    <div className="font-semibold bg-blue-500 text-white p-2 w-30">Apellido</div>
                    <div className="p-2">{data?.lastname}</div>
                </div>
                <div className="flex flex-row  bg-white border border-blue-600">
                    <div className="font-semibold bg-blue-500 text-white p-2 w-30">Email</div>
                    <div className="p-2">{data?.email}</div>
                </div>
                <div className="flex flex-row  bg-white border border-blue-600">
                    <div className="font-semibold bg-blue-500 text-white p-2 w-30">DNI</div>
                    <div className="p-2">{data?.dni}</div>
                </div>
                <div className="flex flex-row  bg-white border border-blue-600">
                    <div className="font-semibold bg-blue-500 text-white p-2 w-30">Roles</div>
                    <div className="flex flex-col  items-start gap-2 m-2">
                        {/* APLICAR UN FORMATO DE COLOR A CADA ROL */}
                        {
                            data.roles?.map((role: string) => {
                                const roleStyle = rolesColors.find((roleColor) => roleColor.role === role);
                                return (
                                    <div
                                        key={role}
                                        className={`${roleStyle?.style || 'bg-gray-500'} text-white px-2 py-1 rounded-md`}
                                    >
                                        {role}
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>

            </div>

        </TitleContainer>

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
