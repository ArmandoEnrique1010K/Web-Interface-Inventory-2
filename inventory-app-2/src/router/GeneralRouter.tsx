

import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '@/layout/AuthLayout'
import { LoginForm } from '@/features/Auth/components/LoginForm'
import { DashboardLayout } from '@/layout/DashboardLayout'
import { ForgotUserPasswordForm } from '@/features/Auth/components/ForgotUserPasswordForm'
import { ValidateUserTokenForm } from '@/features/Auth/components/ValidateUserTokenForm'
import { UpdateUserPasswordForm } from '@/features/Auth/components/UpdateUserPasswordForm'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { UserProfile } from '@/features/Profile/components/UserProfile'
import { Loading } from '@/views/Loading'
import type { MenuItem } from 'types'
import { CubeIcon, DocumentDuplicateIcon, NewspaperIcon, RectangleGroupIcon, TagIcon, TruckIcon } from '@heroicons/react/24/outline'
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
import { CreditsDetails } from '@/features/Credits/components/CreditsDetails'
import { ProfileEditLoader } from '@/features/Profile/components/ProfileEditLoader'
import { ModelList } from '@/features/Product/components/model/ModelList'
import { ModelAddInProductForm } from '@/features/Product/components/model/ModelAddInProductForm'
import { ModelEditLoader } from '@/features/Product/components/model/ModelEditLoader'
import { CompanyList } from '@/features/StockLot/components/company/CompanyList'
import { CompanyAddForm } from '@/features/StockLot/components/company/CompanyAddForm'
import { CompanyEditLoader } from '@/features/StockLot/components/company/CompanyEditLoader'
import { ModelDetails } from '@/features/Product/components/model/ModelDetails'
import { StockLotList } from '@/features/StockLot/components/stocklot/StockLotList'
import { StockLotRegisterForm } from '@/features/StockLot/components/stocklot/StockLotRegisterForm'
import { StockLotIncreaseForm } from '@/features/StockLot/components/stocklot/StockLotIncreaseForm'

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

const stockLotsItems: MenuItem[] = [
    {
        label: 'Lotes de stock',
        icon: <CubeIcon className='size-6' />,
        to: '/stocklots'
    },
    {
        label: 'Empresas importadoras',
        icon: <TruckIcon className='size-6' />,
        to: '/stocklots/companies'
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
                            <h1>TODO: AQUI SE COLOCA EL DASHBOARD PRINCIPAL</h1>
                        } />

                        <Route path="products" element={
                            <NavbarContainer menuItems={productItems} keyword='products'>
                                <Outlet />
                            </NavbarContainer>
                        }>
                            <Route index element={<ProductList />} />
                            <Route path=":id" element={<ProductDetails />} />
                            <Route path="new" element={<ProductAddForm />} />
                            <Route path="edit/:id" element={<ProductEditLoader />} />

                            <Route path=":id/models/new" element={<ModelAddInProductForm />} />
                            <Route path=":productId/models/edit/:modelId" element={<ModelEditLoader />} />
                            <Route path="models" element={<ModelList />} />
                            <Route path=":productId/models/:modelId" element={<ModelDetails />} />

                            <Route path="categories" element={<CategoryList />} />
                            <Route path="categories/new" element={<CategoryAddForm />} />
                            <Route path="categories/edit/:id" element={<CategoryEditLoader />} />
                            <Route path="types" element={<TypeList />} />
                            <Route path="types/new" element={<TypeAddForm />} />
                            <Route path="types/edit/:id" element={<TypeEditLoader />} />
                        </Route>

                        <Route path='stocklots' element={
                            <NavbarContainer menuItems={stockLotsItems} keyword='stocklots'>
                                <Outlet />
                            </NavbarContainer>
                        }>
                            <Route index element={<StockLotList />} />
                            <Route path="new" element={<StockLotRegisterForm />} />
                            <Route path=":id/increase" element={<StockLotIncreaseForm />} />
                            <Route path="companies" element={<CompanyList />} />
                            <Route path="companies/new" element={<CompanyAddForm />} />
                            <Route path="companies/edit/:id" element={<CompanyEditLoader />} />
                        </Route>


                        <Route path="profile" element={
                            <Outlet />
                        }>
                            <Route index element={<UserProfile />} />
                            <Route path='update' element={<ProfileEditLoader />} />
                        </Route>

                        <Route path="credits" element={
                            <Outlet />
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
