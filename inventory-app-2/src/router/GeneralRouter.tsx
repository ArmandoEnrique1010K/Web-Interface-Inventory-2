import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '@/layout/app/AuthLayout'
import { LoginForm } from '@/features/Auth/views/LoginForm'
import { DashboardLayout } from '@/layout/app/DashboardLayout'
import { RestoreUserPasswordForm } from '@/features/Auth/views/RestoreUserPasswordForm'
import { ValidateUserTokenForm } from '@/features/Auth/views/ValidateUserTokenForm'
import { UpdateUserPasswordForm } from '@/features/Auth/views/UpdateUserPasswordForm'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { UserProfile } from '@/features/Profile/components/UserProfile'
import { Loading } from '@/views/Loading'
import type { MenuItem } from 'types'
import { CubeIcon, DocumentDuplicateIcon, FlagIcon, MapIcon, MapPinIcon, NewspaperIcon, RectangleGroupIcon, TagIcon, TruckIcon } from '@heroicons/react/24/outline'
import { NewCategoryPage } from '@/features/Product/views/category/NewCategoryPage'
import { ListCategoryPage } from '@/features/Product/views/category/ListCategoryPage'
import { NavbarContainer } from '@/components/NavbarContainer'
import { CreditsDetails } from '@/features/Credits/components/CreditsDetails'
import { ProfileEditLoader } from '@/features/Profile/components/ProfileEditLoader'
import { ListModelPage } from '@/features/Product/views/model/ListModelPage'
import { NewModelProductPage } from '@/features/Product/views/product/NewModelProductPage'
import { CompanyList } from '@/features/StockLot/components/company/CompanyList'
import { CompanyAddForm } from '@/features/StockLot/components/company/CompanyAddForm'
import { CompanyEditLoader } from '@/features/StockLot/components/company/CompanyEditLoader'
import { DetailsModelPage } from '@/features/Product/views/model/DetailsModelPage'
import { StockLotList } from '@/features/StockLot/components/stocklot/StockLotList'
import { StockLotRegisterForm } from '@/features/StockLot/components/stocklot/StockLotRegisterForm'
import { StockLotIncreaseForm } from '@/features/StockLot/components/stocklot/StockLotIncreaseForm'
import { StockLotDecreaseForm } from '../features/StockLot/components/stocklot/StockLotDecreaseForm';
import { StockLotRecoveryForm } from '@/features/StockLot/components/stocklot/StockLotRecoveryForm'
import { StockLotTransferStocksLoader } from '@/features/StockLot/components/stocklot/StockLotTransferStocksLoader'
import { StockLotDetails } from '@/features/StockLot/components/stocklot/StockLotDetails'
import { ListRegionPage } from '@/features/Location/views/region/ListRegionPage'
import { NewRegionPage } from '@/features/Location/views/region/NewRegionPage'
import { LoaderRegionPage } from '@/features/Location/views/region/LoaderRegionPage'
import { NewSubregionPage } from '@/features/Location/views/subregion/NewSubregionPage'
import { LoaderSubregionPage } from '@/features/Location/views/subregion/LoaderSubregionPage'
import { ListLocationPage } from '@/features/Location/views/location/ListLocationPage'
import { NewLocationPage } from '@/features/Location/views/location/NewLocationPage'
import { LoaderLocationPage } from '@/features/Location/views/location/LoaderLocationPage'
import { MovementList } from '@/features/Movement/components/MovementList'
import { DetailsProductPage } from '@/features/Product/views/product/DetailsProductPage'
import { ListProductPage } from '@/features/Product/views/product/ListProductPage'
import { NewProductPage } from '@/features/Product/views/product/NewProductPage'
import { LoaderProductPage } from '@/features/Product/views/product/LoaderProductPage'
import { ListTypePage } from '@/features/Product/views/type/ListTypePage'
import { NewTypePage } from '@/features/Product/views/type/NewTypePage'
import { LoaderTypePage } from '@/features/Product/views/type/LoaderTypePage'
import { LoaderCategoryPage } from '@/features/Product/views/category/LoaderCategoryPage'
import { LoaderModelPage } from '@/features/Product/views/model/LoaderModelPage';
import { ListSubregionPage } from '@/features/Location/views/subregion/ListSubregionPage'
import { ListUserPage } from '@/features/User/views/ListUserPage'
import { RegisterUserPage } from '@/features/User/views/RegisterUserPage'
import { LoaderUserPage } from '@/features/User/views/LoaderUserPage'

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
const locationItems: MenuItem[] = [
    {
        label: 'Ubicaciones',
        icon: <MapPinIcon className='size-6' />,
        to: '/locations'
    },
    {
        label: 'Subregiones',
        icon: <MapIcon className='size-6' />,
        to: '/locations/subregions'
    },
    {
        label: 'Regiones',
        icon: <FlagIcon className='size-6' />,
        to: '/locations/regions'
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
                        <Route path="restore-password" element={<RestoreUserPasswordForm />} />
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
                            {/* RELACIONADO A PRODUCTS */}
                            <Route index element={<ListProductPage />} />
                            <Route path=":id" element={<DetailsProductPage />} />
                            <Route path="new" element={<NewProductPage />} />
                            <Route path="edit/:id" element={<LoaderProductPage />} />

                            {/* RELACIONADO A MODELS */}
                            <Route path="models" element={<ListModelPage />} />
                            {/* :id es el ID del producto que corresponde al modelo */}
                            <Route path=":id/models/new" element={<NewModelProductPage />} />
                            <Route path=":productId/models/edit/:modelId" element={<LoaderModelPage />} />
                            <Route path=":productId/models/:modelId" element={<DetailsModelPage />} />

                            {/* RELACIONADO A CATEGORIES */}
                            <Route path="categories" element={<ListCategoryPage />} />
                            <Route path="categories/new" element={<NewCategoryPage />} />
                            <Route path="categories/edit/:id" element={<LoaderCategoryPage />} />

                            {/* RELACIONADO A TYPES */}
                            <Route path="types" element={<ListTypePage />} />
                            <Route path="types/new" element={<NewTypePage />} />
                            <Route path="types/edit/:id" element={<LoaderTypePage />} />
                        </Route>

                        <Route path='stocklots' element={
                            <NavbarContainer menuItems={stockLotsItems} keyword='stocklots'>
                                <Outlet />
                            </NavbarContainer>
                        }>
                            {/* RELACIONADO A STOCKLOT */}
                            <Route index element={<StockLotList />} />
                            <Route path="new" element={<StockLotRegisterForm />} />
                            <Route path=":id" element={<StockLotDetails />} />
                            <Route path=":id/increase" element={<StockLotIncreaseForm />} />
                            <Route path=":id/decrease" element={<StockLotDecreaseForm />} />
                            <Route path=":id/recovery" element={<StockLotRecoveryForm />} />
                            <Route path=":id/transfer" element={<StockLotTransferStocksLoader />} />

                            {/* RELACIONADO A COMPANIES */}
                            <Route path="companies" element={<CompanyList />} />
                            <Route path="companies/new" element={<CompanyAddForm />} />
                            <Route path="companies/edit/:id" element={<CompanyEditLoader />} />
                        </Route>


                        <Route path='locations' element={
                            <NavbarContainer menuItems={locationItems} keyword='locations'>
                                <Outlet />
                            </NavbarContainer>
                        }>
                            <Route index element={<ListLocationPage />} />
                            <Route path="new" element={<NewLocationPage />} />
                            <Route path="edit/:id" element={<LoaderLocationPage />} />

                            <Route path="regions" element={<ListRegionPage />} />
                            <Route path="regions/new" element={<NewRegionPage />} />
                            <Route path="regions/edit/:id" element={<LoaderRegionPage />} />

                            <Route path="subregions" element={<ListSubregionPage />} />
                            <Route path="subregions/add" element={<NewSubregionPage />} />
                            <Route path="subregions/edit/:id" element={<LoaderSubregionPage />} />
                        </Route>

                        {/* RELACIONADO A USER */}
                        <Route path='users' element={
                            <Outlet />
                        }>
                            <Route index element={<ListUserPage />} />
                            <Route path='new' element={<RegisterUserPage />} />
                            <Route path=':id/alter' element={<LoaderUserPage />} />

                        </Route>
                        {/* RELACIONADO A MOVEMENT */}
                        <Route path='movements' element={
                            <Outlet />
                        }>
                            <Route index element={<MovementList />} />

                        </Route>


                        {/* RELACIONADO A PROFILE */}
                        <Route path="profile" element={
                            <Outlet />
                        }>
                            <Route index element={<UserProfile />} />
                            <Route path='update' element={<ProfileEditLoader />} />
                        </Route>

                        {/* RELACIONADO A CREDITS */}
                        <Route path="credits" element={
                            <Outlet />
                        }>
                            <Route index element={<CreditsDetails />} />
                        </Route>

                        {/* CUALQUIER OTRA RUTA REDIRIGIRA AL LOGIN O AL DASHBOARD (SI HA INICIADO SESION) */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                )}
            </Routes>
        </BrowserRouter>
    )
}
