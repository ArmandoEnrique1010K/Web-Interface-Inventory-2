import { Link, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import type { MenuItem } from "@/types";

type Props = {
    menuItems?: MenuItem[];
    children: React.ReactNode;
    keyword: string;
};

export const NavbarContainer = ({ menuItems, children, keyword }: Props) => {
    const location = useLocation();

    // TODO: ESTA FUNCIÓN SE PODRIA TRASLADAR A LA CARPETA UTILS EN UNA FUTURA ACTUALIZACIÓN
    const styleToCurrentPath = (to: string) => {
        const path = location.pathname;

        // Caso especial: boton Productos
        if (to === `/${keyword}`) {
            if (
                path === `/${keyword}` ||
                path.startsWith(`/${keyword}/new`) ||
                path.match(new RegExp(`^/${keyword}/\\d+`)) ||
                path.match(new RegExp(`^/${keyword}/edit/\\d+`))
            ) {
                return "border-b-2 border-blue-600 text-blue-600 bg-blue-50";
            }
            return "text-slate-600 hover:text-blue-600 hover:bg-slate-100";
        }

        // Otros modulos (models, categories, types)
        if (path.startsWith(to)) {
            return "border-b-2 border-blue-600 text-blue-600 bg-blue-50";
        }

        return "text-slate-600 hover:text-blue-600 hover:bg-slate-100";
    };

    // React responsive establece unos "puntos de cortes" en donde se aplicara una condición de acuerdo al ancho de pantalla
    const isSmallScreen = useMediaQuery({ query: "(max-width: 705px)" });
    const isExtraSmallScreen = useMediaQuery({ query: "(max-width: 420px)" });

    return (
        // min-h-dvh es una clase de utilidad que establece la altura mínima de un elemento al 100% de la altura de la
        // Ventana Gráfica Dinámica (Dynamic Viewport Height - dvh). Esto asegura que el elemento sea al menos tan alto
        // como la pantalla, ajustándose automáticamente si las barras de herramientas del navegador (como en móviles)
        // se contraen o expanden
        <div className="min-h-dvh flex flex-col">
            <div className="flex flex-row bg-white border-b border-slate-200 text-slate-700">
                {menuItems &&
                    menuItems.map((item) => (
                        <Link
                            to={item.to}
                            className={`
                        flex items-center gap-2 
                        px-4 py-3 
                        font-medium 
                        transition-colors
                        ${styleToCurrentPath(item.to)} 
                        `}
                            key={item.label}
                        >
                            <span>
                                {!isSmallScreen && item.icon}
                                {isExtraSmallScreen && item.icon}
                            </span>
                            <h1 className={``}>
                                {!isExtraSmallScreen && item.label}
                            </h1>
                        </Link>
                    ))}
            </div>

            {children}
        </div>
    );
};
