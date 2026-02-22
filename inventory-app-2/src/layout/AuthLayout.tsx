import { Outlet } from "react-router-dom"

export const AuthLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-500">
            <div className="flex flex-row items-center justify-center bg-blue-500 my-auto">
                <div className="flex flex-col items-center space-y-8 ">
                    <img src="/imprenta.png" alt="Logo de Imprenta" className="size-60" />
                </div>
                <div className="flex items-center justify-center">
                    {/* El formulario se mostrara aqui */}
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

// TODO: AGREGAR CREDITOS
//             <a target="_blank" href="https://icons8.com/icon/13133/trolley">Inventario</a> icono de <a target="_blank" href="https://icons8.com">Icons8</a>
// <a href="https://www.flaticon.es/iconos-gratis/imprenta" title="imprenta iconos">Imprenta iconos creados por Paul J. - Flaticon</a>