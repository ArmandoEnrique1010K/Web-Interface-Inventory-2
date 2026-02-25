import React, { useEffect, useState } from 'react'
import type { MenuItem } from '../types'
import { Link, useLocation, useNavigate } from 'react-router-dom';

type Props = {
    title?: string;
    menuItems?: MenuItem[];
    children: React.ReactNode
}

export const ModuleContainer = ({ title, menuItems, children }: Props) => {
    const navigate = useNavigate()
    const location = useLocation();

    // Contiene el nombre de la sección actual basado en el menú
    const [titleFromMenu, setTitleFromMenu] = useState('');

    const styleToCurrentPath = (to: string) => {
        // Previamente se utilizo (location.pathname === to)
        if (location.pathname.includes(to) && (to !== '/products' || location.pathname === '/products')) {
            return 'bg-blue-700';
        }
        return 'bg-gray-500';
    }

    const getLabelFromPath = (path: string) => {
        const endpath = path.split('/').pop() || '';

        const found = menuItems?.find(item => item.to.includes(endpath));
        return found?.label || '';
    }


    console.log(getLabelFromPath(location.pathname))


    useEffect(() => {
        const found = menuItems?.find((item) => location.pathname.includes(item.to))?.label || '';
        setTitleFromMenu(found);
        console.log('titleFromMenu', titleFromMenu);
    }, [location.pathname, menuItems]);


    return (
        <div className='flex flex-col flex-1'>
            <div className='flex flex-row text-white  bg-gray-500'>
                {
                    menuItems && menuItems.map((item) => (
                        <Link to={item.to} className={`flex flex-row items-center gap-2 ${styleToCurrentPath(item.to)} px-5 py-2`} key={item.label}>
                            {item.icon}
                            <h1>{item.label}</h1>
                        </Link>
                    ))
                }
            </div>
            <div className='p-4'>
                {/* <h1 className='text-4xl font-bold mb-2'>
                    {title || getLabelFromPath(location.pathname)}
                </h1> */}


                {children}

            </div>

        </div>
    )
}
