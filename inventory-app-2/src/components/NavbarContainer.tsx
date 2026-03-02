import { Link, useLocation } from 'react-router-dom';
import type { MenuItem } from 'types'

type Props = {
    title?: string;
    menuItems?: MenuItem[];
    children: React.ReactNode
}

export const NavbarContainer = ({ menuItems, children }: Props) => {
    const location = useLocation();

    const styleToCurrentPath = (to: string) => {
        // Previamente se utilizo (location.pathname === to)
        if (location.pathname.includes(to) && (to !== '/products' || location.pathname === '/products' || location.pathname === '/products/new' || location.pathname.includes('/products/edit'))) {
            return 'bg-blue-700';
        }
        return 'bg-gray-500';
    }

    // const getLabelFromPath = (path: string) => {
    //     const endpath = path.split('/').pop() || '';

    //     const found = menuItems?.find(item => item.to.includes(endpath));
    //     return found?.label || '';
    // }


    // console.log(getLabelFromPath(location.pathname))

    return (
        <div className='flex flex-col '>
            <div className='flex flex-row text-white bg-gray-500'>
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
                {children}
            </div>
        </div>
    )
}
