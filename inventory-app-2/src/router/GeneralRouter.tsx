

import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '@/layout/AuthLayout'
import { LoginForm } from '@/features/Auth/components/LoginForm'
import { DashboardLayout } from '@/layout/DashboardLayout'
import { ForgotUserPasswordForm } from '@/features/Auth/components/ForgotUserPasswordForm'
import { ValidateUserTokenForm } from '@/features/Auth/components/ValidateUserTokenForm'
import { UpdateUserPasswordForm } from '@/features/Auth/components/UpdateUserPasswordForm'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { UserProfile } from '@/features/User/views/UserProfile'
import { Loading } from '@/views/Loading'
import type { MenuItem } from 'types'
import { DocumentDuplicateIcon, NewspaperIcon, RectangleGroupIcon, TagIcon } from '@heroicons/react/24/outline'
import { CategoryAddForm } from '@/features/Product/components/category/CategoryAddForm'
import { CategoryList } from '@/features/Product/components/category/CategoryList'
import { CategoryEditLoader } from '@/features/Product/components/category/CategoryEditLoader'
import { NavbarContainer } from '@/components/NavbarContainer'

const productItems: MenuItem[] = [
    {
        label: 'Productos',
        icon: <NewspaperIcon className='size-6' />,
        to: '/products'
    },
    {
        label: 'Modelos',
        icon: <DocumentDuplicateIcon className='size-6' />,
        to: '/products/models'
    },
    {
        label: 'Categorias',
        icon: <TagIcon className='size-6' />,
        to: '/products/categories'
    },
    {
        label: 'Tipos',
        icon: <RectangleGroupIcon className='size-6' />,
        to: '/products/types'
    }
]

export const GeneralRouter = () => {

    const { isAuthenticated, authChecked } = useSelector(
        (state: RootState) => state.auth
    )

    if (!authChecked) {
        return <Loading />
    }


    return (
        <BrowserRouter>
            <Routes>

                {/* Rutas públicas */}
                {!isAuthenticated && (
                    <Route path="/" element={<AuthLayout />}>
                        <Route index element={<LoginForm />} />
                        <Route path="restore-password" element={<ForgotUserPasswordForm />} />
                        <Route path="validate-token" element={<ValidateUserTokenForm />} />
                        <Route path="update-password" element={<UpdateUserPasswordForm />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                )}

                {/* Rutas privadas */}
                {isAuthenticated && (
                    <Route path="/" element={<DashboardLayout />}>
                        <Route index element={
                            <NavbarContainer title="Bienvenido">
                                <h1>TODO: CREAR DASHBOARD LAYOUT</h1>
                            </NavbarContainer>
                        } />

                        <Route path="products" element={
                            <NavbarContainer menuItems={productItems}>
                                <Outlet />
                            </NavbarContainer>
                        }>
                            <Route index element={<h1>Pagina de lista de productos</h1>} />
                            <Route path="new" element={<h1>Formulario de nuevo producto</h1>} />
                            <Route path="edit/:id" element={<h1>Formulario de editar producto</h1>} />

                            {/* TODO: EN EL BACKEND, CREAR UN ENDPOINT PARA LISTAR PRODUCTOS Y NO MODELOS DE PRODUCTOS */}
                            <Route path="categories" element={<CategoryList />} />
                            <Route path="categories/new" element={<CategoryAddForm />} />
                            <Route path="categories/edit/:id" element={<CategoryEditLoader />} />

                            <Route path="models" element={<h1>Pagina de lista de modelos</h1>} />
                            <Route path="models/new" element={<h1>Formulario de nuevo modelo</h1>} />
                            <Route path="models/edit/:id" element={<h1>Formulario de editar modelo</h1>} />

                            <Route path="types" element={<h1>Pagina de lista de tipos</h1>} />
                            <Route path="types/new" element={<h1>Formulario de nuevo tipo</h1>} />
                            <Route path="types/edit/:id" element={<h1>Formulario de editar tipo</h1>} />


                        </Route>


                        <Route path="profile" element={
                            <NavbarContainer title='Perfil del usuario'>
                                <Outlet />
                            </NavbarContainer>

                        }>
                            <Route index element={<UserProfile />} />
                            <Route path='update' element={<h1> ACTUALIZAR PERFIL</h1>} />
                        </Route>



                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                )}

            </Routes>
        </BrowserRouter>
    )
}
