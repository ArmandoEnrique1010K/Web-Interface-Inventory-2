import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '@/layout/app/AuthLayout'
import { LoginForm } from '@/features/Auth/views/LoginForm'
import { DashboardLayout } from '@/layout/app/DashboardLayout'
import { RestoreUserPasswordForm } from '@/features/Auth/views/RestoreUserPasswordForm'
import { ValidateUserTokenForm } from '@/features/Auth/views/ValidateUserTokenForm'
import { UpdateUserPasswordForm } from '@/features/Auth/views/UpdateUserPasswordForm'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { Loading } from '@/views/Loading'
import type { MenuItem } from 'types'
import { ClipboardDocumentCheckIcon, ClipboardDocumentListIcon, ClipboardIcon, CubeIcon, DocumentDuplicateIcon, FlagIcon, MapIcon, MapPinIcon, NewspaperIcon, RectangleGroupIcon, TagIcon, TruckIcon } from '@heroicons/react/24/outline'
import { NewCategoryPage } from '@/features/Product/views/category/NewCategoryPage'
import { ListCategoryPage } from '@/features/Product/views/category/ListCategoryPage'
import { NavbarContainer } from '@/components/NavbarContainer'
import { CreditsDetails } from '@/features/Credits/components/CreditsDetails'
import { LoaderProfile } from '@/features/Profile/components/LoaderProfile'
import { ListModelPage } from '@/features/Product/views/model/ListModelPage'
import { ListCompanyPage } from '@/features/StockLot/views/company/ListCompanyPage'
import { NewCompanyPage } from '@/features/StockLot/views/company/NewCompanyPage'
import { DetailsModelPage } from '@/features/Product/views/model/DetailsModelPage'
import { ListStockLotPage } from '@/features/StockLot/views/stocklot/ListStockLotPage'
import { NewStockLotPage } from '@/features/StockLot/views/stocklot/NewStockLotPage'
import { DetailsStockLotPage } from '@/features/StockLot/views/stocklot/DetailsStockLotPage'
import { ListRegionPage } from '@/features/Location/views/region/ListRegionPage'
import { NewRegionPage } from '@/features/Location/views/region/NewRegionPage'
import { NewSubregionPage } from '@/features/Location/views/subregion/NewSubregionPage'
import { ListLocationPage } from '@/features/Location/views/location/ListLocationPage'
import { NewLocationPage } from '@/features/Location/views/location/NewLocationPage'
import { MovementList } from '@/features/Movement/components/MovementList'
import { DetailsProductPage } from '@/features/Product/views/product/DetailsProductPage'
import { ListProductPage } from '@/features/Product/views/product/ListProductPage'
import { NewProductPage } from '@/features/Product/views/product/NewProductPage'
import { ListTypePage } from '@/features/Product/views/type/ListTypePage'
import { NewTypePage } from '@/features/Product/views/type/NewTypePage'
import { ListSubregionPage } from '@/features/Location/views/subregion/ListSubregionPage'
import { ListUserPage } from '@/features/User/views/ListUserPage'
import { RegisterUserPage } from '@/features/User/views/RegisterUserPage'
import { UserProfilePage } from '@/features/Profile/views/UserProfilePage'
import { ListDeliveryOrderPage } from '@/features/Order/views/deliveryOrder/ListDeliveryOrderPage'
import { NewDeliveryOrderPage } from '@/features/Order/views/deliveryOrder/NewDeliveryOrderPage'
import { DetailsDeliveryOrderPage } from '@/features/Order/views/deliveryOrder/DetailsDeliveryOrderPage'
import { ListPendingDeliveryOrderPage } from '@/features/Order/views/deliveryOrder/ListPendingDeliveryOrderPage'
import { ListDeliveryOrderByCurrentUserPage } from '@/features/Order/views/deliveryOrder/ListDeliveryOrderByCurrentUserPage'

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


const orderItems: MenuItem[] = [
    {
        label: 'Todas las ordenes',
        icon: <ClipboardDocumentListIcon className='size-6' />,
        to: "/orders"
    },
    {
        label: 'Ordenes pendientes',
        icon: <ClipboardDocumentCheckIcon className='size-6' />,
        to: "/orders/pending"
    },
    {
        label: 'Mis ordenes',
        icon: <ClipboardIcon className='size-6' />,
        to: "/orders/my-orders"
    },

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

                            {/* RELACIONADO A MODELS */}
                            <Route path="models" element={<ListModelPage />} />
                            {/* :productId es el ID del producto que corresponde al modelo */}
                            <Route path=":productId/models/:modelId" element={<DetailsModelPage />} />

                            {/* RELACIONADO A CATEGORIES */}
                            <Route path="categories" element={<ListCategoryPage />} />
                            <Route path="categories/new" element={<NewCategoryPage />} />

                            {/* RELACIONADO A TYPES */}
                            <Route path="types" element={<ListTypePage />} />
                            <Route path="types/new" element={<NewTypePage />} />
                        </Route>

                        {/* RELACIONADO A USER */}
                        <Route path='users' element={
                            <Outlet />
                        }>
                            <Route index element={<ListUserPage />} />
                            <Route path='new' element={<RegisterUserPage />} />
                        </Route>

                        {/* RELACIONADO A LOCATION */}
                        <Route path='locations' element={
                            <NavbarContainer menuItems={locationItems} keyword='locations'>
                                <Outlet />
                            </NavbarContainer>
                        }>
                            <Route index element={<ListLocationPage />} />
                            <Route path="new" element={<NewLocationPage />} />

                            <Route path="regions" element={<ListRegionPage />} />
                            <Route path="regions/new" element={<NewRegionPage />} />

                            <Route path="subregions" element={<ListSubregionPage />} />
                            <Route path="subregions/new" element={<NewSubregionPage />} />
                        </Route>

                        {/* RELACIONADO A PROFILE */}
                        <Route path="profile" element={
                            <Outlet />
                        }>
                            <Route index element={<UserProfilePage />} />
                            <Route path='update' element={<LoaderProfile />} />
                        </Route>

                        {/* RELACIONADO A STOCKLOT */}
                        <Route path='stocklots' element={
                            <NavbarContainer menuItems={stockLotsItems} keyword='stocklots'>
                                <Outlet />
                            </NavbarContainer>
                        }>
                            <Route index element={<ListStockLotPage />} />
                            <Route path="new" element={<NewStockLotPage />} />
                            <Route path=":id" element={<DetailsStockLotPage />} />

                            {/* RELACIONADO A COMPANIES */}
                            <Route path="companies" element={<ListCompanyPage />} />
                            <Route path="companies/new" element={<NewCompanyPage />} />
                        </Route>

                        {/* TODO: CONTINUAR AQUI */}
                        {/* RELACIONADO A ORDENES */}

                        <Route path='orders' element={
                            <NavbarContainer menuItems={orderItems} keyword='orders'>
                                <Outlet />
                            </NavbarContainer>
                        }>
                            <Route index element={<ListDeliveryOrderPage />} />
                            <Route path=":id" element={<DetailsDeliveryOrderPage />} />

                            <Route path="pending" element={<ListPendingDeliveryOrderPage />} />
                            <Route path="pending/:id" element={<DetailsDeliveryOrderPage />} />


                            <Route path="my-orders" element={<ListDeliveryOrderByCurrentUserPage />} />
                            <Route path="my-orders/:id" element={<DetailsDeliveryOrderPage />} />



                            <Route path="new" element={<NewDeliveryOrderPage />} />

                        </Route>


                        {/* RELACIONADO A MOVEMENT */}
                        <Route path='movements' element={
                            <Outlet />
                        }>
                            <Route index element={<MovementList />} />

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
