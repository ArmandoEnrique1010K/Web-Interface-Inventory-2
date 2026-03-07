

import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '@/layout/AuthLayout'
import { LoginForm } from '@/features/Auth/components/LoginForm'
import { DashboardLayout } from '@/layout/DashboardLayout'
import { ForgotUserPasswordForm } from '@/features/Auth/components/ForgotUserPasswordForm'
import { ValidateUserTokenForm } from '@/features/Auth/components/ValidateUserTokenForm'
import { UpdateUserPasswordForm } from '@/features/Auth/components/UpdateUserPasswordForm'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { UserProfile } from '@/features/User/components/UserProfile'
import { Loading } from '@/views/Loading'
import type { MenuItem } from 'types'
import { DocumentDuplicateIcon, NewspaperIcon, RectangleGroupIcon, TagIcon } from '@heroicons/react/24/outline'
import { CategoryAddForm } from '@/features/Product/components/category/CategoryAddForm'
import { CategoryList } from '@/features/Product/components/category/CategoryList'
import { CategoryEditLoader } from '@/features/Product/components/category/CategoryEditLoader'
import { NavbarContainer } from '@/components/NavbarContainer'
import { TypeList } from '@/features/Product/components/type/TypeList'
import { TypeAddForm } from '@/features/Product/components/type/TypeAddForm'
import { TypeEditLoader } from '@/features/Product/components/type/TypeEditLoader'
import { ProductAddForm } from '@/features/Product/components/product/ProductAddForm'
import { ProductList } from '@/features/Product/components/product/ProductList'
import { ProductEditLoader } from '@/features/Product/components/product/ProductEditLoader'
import { ProductDetails } from '@/features/Product/components/product/ProductDetails'
import { ProfileEditLoader } from '@/features/User/components/ProfileEditLoader'
import { CreditsDetails } from '@/features/Credits/components/CreditsDetails'

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
                            <Route index element={<ProductList />} />
                            <Route path=":id" element={<ProductDetails />} />
                            <Route path="new" element={<ProductAddForm />} />
                            <Route path="edit/:id" element={<ProductEditLoader />} />

                            <Route path="categories" element={<CategoryList />} />
                            <Route path="categories/new" element={<CategoryAddForm />} />
                            <Route path="categories/edit/:id" element={<CategoryEditLoader />} />
                            <Route path="types" element={<TypeList />} />
                            <Route path="types/new" element={<TypeAddForm />} />
                            <Route path="types/edit/:id" element={<TypeEditLoader />} />


                            <Route path="models" element={<h1>Pagina de lista de modelos</h1>} />
                            <Route path="models/new" element={<h1>Formulario de nuevo modelo</h1>} />
                            <Route path="models/edit/:id" element={<h1>Formulario de editar modelo</h1>} />


                        </Route>


                        <Route path="profile" element={
                            <NavbarContainer title='Perfil del usuario'>
                                <Outlet />
                            </NavbarContainer>
                        }>
                            <Route index element={<UserProfile />} />
                            <Route path='update' element={<ProfileEditLoader />} />
                        </Route>

                        <Route path="credits" element={
                            <NavbarContainer title='Creditos del autor'>
                                <Outlet />
                            </NavbarContainer>
                        }>
                            <Route index element={<CreditsDetails />} />
                        </Route>



                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                )}

            </Routes>
        </BrowserRouter>
    )
}
