import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
    return (
        // IGNORAR LOS ID "outer-container" Y "page-wrap" SOLAMENTE SE UTILIZAN PARA NO MOSTRAR UN ERROR EN LA CONSOLA CUANDO EL COMPONENTE <SidebarMenuView/> SE DESMONTA AL CERRAR SESION
        <div
            id="outer-container"
            className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8"
        >
            <div
                id="page-wrap"
                className="bg-white shadow-xl hover:shadow-2xl transition-shadow rounded-2xl w-full max-w-md sm:p-6 p-4"
            >
                <div className="hidden md:flex justify-center mb-6">
                    <img
                        src="/imprenta.png"
                        alt="Logo de Imprenta"
                        className="size-40 object-contain "
                    />
                </div>

                {/* El formulario se mostrara aqui */}
                <Outlet />
            </div>
        </div>
    );
};
