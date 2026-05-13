import { Outlet, useLocation } from "react-router-dom";
import { SidebarMenuView } from "@/views/Sidebar/SidebarMenuView";
import { useEffect } from "react";

export default function DashboardLayout() {
    const { pathname } = useLocation();

    // Cuando navegas entre rutas, el scroll NO se resetea. Es comportamiento normal de SPA con React Router DOM

    // Estás en una página con scroll abajo
    // Navegas a otra ruta
    // React cambia el componente → pero no toca el scroll del navegador
    // Resultado → te quedas en la misma posición

    // Cada vez que el usuario visita una pagina diferente (mediante la URL de la barra navegacion)
    // Se hara un scroll o se deslizara el scroll hacia las coordenadas x = 0 / y = 0 (al inicio de la pagina)

    // Abre devtools y ejecuta: "window.scrollY", Si no cambia cuando haces scroll → tu scroll está en un contenedor.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            {/* ID DE REACT-BURGER-MENU: OUTER-CONTAINER Y PAGE-WRAP */}
            <div
                id="outer-container"
                className="flex flex-col sm:flex-row bg-slate-50 min-h-screen "
            >
                <SidebarMenuView />
                <main id="page-wrap" className="overflow-y-auto w-full">
                    <Outlet />
                </main>
            </div>
        </>
    );
}
