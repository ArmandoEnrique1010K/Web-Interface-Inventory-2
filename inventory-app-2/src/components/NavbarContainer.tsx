import { Link, useLocation } from 'react-router-dom';
import type { MenuItem } from 'types'
import { useMediaQuery } from 'react-responsive'

type Props = {
    menuItems?: MenuItem[];
    children: React.ReactNode
}

export const NavbarContainer = ({ menuItems, children }: Props) => {
    const location = useLocation();

    // TODO: ESTA FUNCIÓN SE PODRIA TRASLADAR A LA CARPETA UTILS
    const styleToCurrentPath = (to: string) => {
        // Previamente se utilizo (location.pathname === to)
        if (location.pathname.includes(to) && (
            to !== '/products' ||
            location.pathname === '/products' ||
            location.pathname === '/products/new' ||
            (location.pathname.includes('/products/edit') && /\/\d+$/.test(location.pathname)) || // Si termina en un numero (editar)
            (location.pathname.includes('/products') && /\/\d+$/.test(location.pathname)) // obtener producto
        )) {
            return 'bg-blue-700';
        }
        return 'bg-gray-500';
    }

    // React responsive establece unos "puntos de cortes" en donde se aplicara una condición de acuerdo al ancho de pantalla
    const isSmallScreen = useMediaQuery({ query: '(max-width: 705px)' })
    const isExtraSmallScreen = useMediaQuery({ query: '(max-width: 420px)' })

    return (
        // min-h-dvh es una clase de utilidad que establece la altura mínima de un elemento al 100% de la altura de la 
        // Ventana Gráfica Dinámica (Dynamic Viewport Height - dvh). Esto asegura que el elemento sea al menos tan alto 
        // como la pantalla, ajustándose automáticamente si las barras de herramientas del navegador (como en móviles) 
        // se contraen o expanden
        <div className='min-h-dvh flex flex-col'>
            <div className='flex flex-row text-white bg-gray-500'>
                {
                    menuItems && menuItems.map((item) => (
                        <Link to={item.to} className={`flex flex-row items-center gap-2 ${styleToCurrentPath(item.to)} px-4 py-2`} key={item.label}>
                            <span>{!isSmallScreen && item.icon}{isExtraSmallScreen && item.icon}</span>
                            <h1 className={``}>{!isExtraSmallScreen && item.label}</h1>
                        </Link>
                    ))
                }
            </div>
            {children}
        </div>
    )
}
