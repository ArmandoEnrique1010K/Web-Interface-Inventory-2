import { Outlet } from "react-router-dom"

export const AuthLayout = () => {

    return (
        <div className="flex flex-col min-h-screen bg-gray-800">
            <div className="flex sm:flex-row flex-col items-center justify-center bg-gray-300 m-auto rounded-xl">
                <div className="flex items-center justify-center sm:px-10 py-4">
                    <img src="/imprenta.png" alt="Logo de Imprenta" className="sm:w-100 w-40" />
                </div>

                {/* El formulario se mostrara aqui */}
                <Outlet />
            </div>
        </div>
    )
}

// TODO: AGREGAR CREDITOS
//             <a target="_blank" href="https://icons8.com/icon/13133/trolley">Inventario</a> icono de <a target="_blank" href="https://icons8.com">Icons8</a>
// <a href="https://www.flaticon.es/iconos-gratis/imprenta" title="imprenta iconos">Imprenta iconos creados por Paul J. - Flaticon</a>
// https://fonts.google.com/specimen/Zalando+Sans?categoryFilters=Feeling:%2FExpressive%2FBusiness
// https://cssloaders.github.io/