import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
    ClipboardDocumentCheckIcon,
    ClipboardDocumentListIcon,
    ClipboardIcon,
    CubeIcon,
    FlagIcon,
    MapIcon,
    MapPinIcon,
    TruckIcon,
} from "@heroicons/react/24/outline";
import { LoaderProfile } from "@/features/Profile/components/LoaderProfile";

import { ListCompanyPage } from "@/features/StockLot/views/company/ListCompanyPage";
import { NewCompanyPage } from "@/features/StockLot/views/company/NewCompanyPage";
import { ListStockLotPage } from "@/features/StockLot/views/stocklot/ListStockLotPage";
import { NewStockLotPage } from "@/features/StockLot/views/stocklot/NewStockLotPage";
import { DetailsStockLotPage } from "@/features/StockLot/views/stocklot/DetailsStockLotPage";
import { UserProfilePage } from "@/features/Profile/views/UserProfilePage";
import { ListDeliveryOrderPage } from "@/features/Order/views/deliveryOrder/ListDeliveryOrderPage";
import { NewDeliveryOrderPage } from "@/features/Order/views/deliveryOrder/NewDeliveryOrderPage";
import { DetailsDeliveryOrderPage } from "@/features/Order/views/deliveryOrder/DetailsDeliveryOrderPage";
import { ListPendingDeliveryOrderPage } from "@/features/Order/views/deliveryOrder/ListPendingDeliveryOrderPage";
import { ListDeliveryOrderByCurrentUserPage } from "@/features/Order/views/deliveryOrder/ListDeliveryOrderByCurrentUserPage";
import { DetailsDeliveryLinePage } from "@/features/Order/views/deliveryLine/DetailsDeliveryLinePage";
import type { MenuItem } from "@/types";
import { ListMovementPage } from "@/features/Movement/views/ListMovementPage";
import { DetailMovementPage } from "@/features/Movement/views/DetailMovementPage";
import { lazy, useEffect } from "react";
import { loadUserSession } from "@/store/authThunks";
import { NavbarContainer } from "@/components/NavbarContainer";
import { ListLocationPage } from "@/features/Location/views/location/ListLocationPage";
import { NewLocationPage } from "@/features/Location/views/location/NewLocationPage";
import { ListRegionPage } from "@/features/Location/views/region/ListRegionPage";
import { NewRegionPage } from "@/features/Location/views/region/NewRegionPage";
import { ListSubregionPage } from "@/features/Location/views/subregion/ListSubregionPage";
import { NewSubregionPage } from "@/features/Location/views/subregion/NewSubregionPage";
import { CreditsPage } from "@/features/Credits/views/CreditsPage";
import { LazyLoader } from "./LazyLoader";
import { LoginForm } from "@/features/Auth/views/LoginForm";
import { RestoreUserPasswordForm } from "@/features/Auth/views/RestoreUserPasswordForm";
import { ValidateUserTokenForm } from "@/features/Auth/views/ValidateUserTokenForm";
import { UpdateUserPasswordForm } from "@/features/Auth/views/UpdateUserPasswordForm";

const stockLotsItems: MenuItem[] = [
    {
        label: "Lotes de stock",
        icon: <CubeIcon className="size-6" />,
        to: "/stocklots",
    },
    {
        label: "Empresas importadoras",
        icon: <TruckIcon className="size-6" />,
        to: "/stocklots/companies",
    },
];
const locationItems: MenuItem[] = [
    {
        label: "Ubicaciones",
        icon: <MapPinIcon className="size-6" />,
        to: "/locations",
    },
    {
        label: "Subregiones",
        icon: <MapIcon className="size-6" />,
        to: "/locations/subregions",
    },
    {
        label: "Regiones",
        icon: <FlagIcon className="size-6" />,
        to: "/locations/regions",
    },
];

const orderItems: MenuItem[] = [
    {
        label: "Todas las ordenes",
        icon: <ClipboardDocumentListIcon className="size-6" />,
        to: "/orders",
    },
    {
        label: "Ordenes pendientes",
        icon: <ClipboardDocumentCheckIcon className="size-6" />,
        to: "/orders/pending",
    },
    {
        label: "Mis ordenes",
        icon: <ClipboardIcon className="size-6" />,
        to: "/orders/my-orders",
    },
];

// Layouts
const AuthLayout = lazy(() => import("@/layout/app/AuthLayout"));
const DashboardLayout = lazy(() => import("@/layout/app/DashboardLayout"));

// Grupo de rutas
const ProductRoutes = lazy(() => import("./ProductRoutes"));
const UserRoutes = lazy(() => import("./UserRoutes"));

// // Componente auxiliar para mostrar un loading mientras se carga el componente
// const Lazy = ({ children }: { children: React.ReactNode }) => (
//     <Suspense fallback={<GeneralLoadingView />}>{children}</Suspense>
// );

// // Función auxiliar para renderizar el componente auxiliar dentro de un componente
// const lazyLoad = (
//     Component: React.LazyExoticComponent<React.ComponentType>,
// ) => (
//     <Lazy>
//         <Component />
//     </Lazy>
// );
// EL CODIGO SE VE MÁS LIMPIO

// TODO: CONTINUAR EN LOS DEMÁS MODULOS DESDE PRODUCT

export const GeneralRouter = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Verifica si hay algun usuario activo
    useEffect(() => {
        dispatch(loadUserSession());
    }, []);

    const { isAuthenticated, authChecked } = useSelector(
        (state: RootState) => state.auth,
    );

    // TODO: SE PODRIA RENDERIZAR OTRO COMPONENTE DE CARGA
    if (!authChecked) {
        return <div>Espere un momento...</div>;
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas públicas */}
                {!isAuthenticated && (
                    <Route
                        path="/*"
                        element={
                            <LazyLoader>
                                <AuthLayout />
                            </LazyLoader>
                        }
                    >
                        <Route index element={<LoginForm />} />
                        <Route
                            path="restore-password"
                            element={<RestoreUserPasswordForm />}
                        />
                        <Route
                            path="validate-token"
                            element={<ValidateUserTokenForm />}
                        />
                        <Route
                            path="update-password"
                            element={<UpdateUserPasswordForm />}
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                )}

                {/* Rutas privadas */}
                {isAuthenticated && (
                    <Route
                        path="/"
                        element={
                            <LazyLoader>
                                <DashboardLayout />
                            </LazyLoader>
                        }
                    >
                        <Route
                            index
                            element={
                                <h1>
                                    TODO: AQUI SE COLOCA EL DASHBOARD PRINCIPAL
                                </h1>
                            }
                        />
                        {/* RELACIONADO A PRODUCTS */}
                        <Route
                            // El * indica que esta ruta acepta cualquier cosa despues
                            path="products/*"
                            element={
                                <LazyLoader>
                                    <ProductRoutes />
                                </LazyLoader>
                                // <NavbarContainer
                                //     menuItems={productItems}
                                //     keyword="products"
                                // >
                                //     <Outlet />
                                // </NavbarContainer>
                            }
                        ></Route>
                        {/* RELACIONADO A USER */}
                        {/* <Route path="users" element={<Outlet />}>
                            <Route index element={<ListUserPage />} />
                            <Route path="new" element={<RegisterUserPage />} />
                        </Route> */}
                        <Route
                            path="users/*"
                            element={
                                <LazyLoader>
                                    <UserRoutes />
                                </LazyLoader>
                            }
                        />
                        {/* RELACIONADO A LOCATION */}
                        <Route
                            path="locations"
                            element={
                                <NavbarContainer
                                    menuItems={locationItems}
                                    keyword="locations"
                                >
                                    <Outlet />
                                </NavbarContainer>
                            }
                        >
                            <Route index element={<ListLocationPage />} />
                            <Route path="new" element={<NewLocationPage />} />

                            <Route
                                path="regions"
                                element={<ListRegionPage />}
                            />
                            <Route
                                path="regions/new"
                                element={<NewRegionPage />}
                            />

                            <Route
                                path="subregions"
                                element={<ListSubregionPage />}
                            />
                            <Route
                                path="subregions/new"
                                element={<NewSubregionPage />}
                            />
                        </Route>
                        // TODO: CONTINUAR AQUI
                        {/* RELACIONADO A PROFILE */}
                        <Route path="profile" element={<Outlet />}>
                            <Route index element={<UserProfilePage />} />
                            <Route path="update" element={<LoaderProfile />} />
                        </Route>
                        {/* RELACIONADO A STOCKLOT */}
                        <Route
                            path="stocklots"
                            element={
                                <NavbarContainer
                                    menuItems={stockLotsItems}
                                    keyword="stocklots"
                                >
                                    <Outlet />
                                </NavbarContainer>
                            }
                        >
                            <Route index element={<ListStockLotPage />} />
                            <Route path="new" element={<NewStockLotPage />} />
                            <Route
                                path=":id"
                                element={<DetailsStockLotPage />}
                            />

                            {/* RELACIONADO A COMPANIES */}
                            <Route
                                path="companies"
                                element={<ListCompanyPage />}
                            />
                            <Route
                                path="companies/new"
                                element={<NewCompanyPage />}
                            />
                        </Route>
                        {/* RELACIONADO A ORDENES */}
                        <Route
                            path="orders"
                            element={
                                <NavbarContainer
                                    menuItems={orderItems}
                                    keyword="orders"
                                >
                                    <Outlet />
                                </NavbarContainer>
                            }
                        >
                            <Route index element={<ListDeliveryOrderPage />} />
                            <Route
                                path=":id"
                                element={<DetailsDeliveryOrderPage />}
                            />

                            <Route
                                path=":deliveryOrderId/line/:deliveryLineId"
                                element={<DetailsDeliveryLinePage />}
                            />

                            <Route
                                path="pending"
                                element={<ListPendingDeliveryOrderPage />}
                            />
                            <Route
                                path="pending/:id"
                                element={<DetailsDeliveryOrderPage />}
                            />
                            <Route
                                path="pending/:deliveryOrderId/line/:deliveryLineId"
                                element={<DetailsDeliveryLinePage />}
                            />

                            <Route
                                path="my-orders"
                                element={<ListDeliveryOrderByCurrentUserPage />}
                            />
                            <Route
                                path="my-orders/:id"
                                element={<DetailsDeliveryOrderPage />}
                            />
                            <Route
                                path="my-orders/:deliveryOrderId/line/:deliveryLineId"
                                element={<DetailsDeliveryLinePage />}
                            />

                            <Route
                                path="new"
                                element={<NewDeliveryOrderPage />}
                            />
                        </Route>
                        {/* RELACIONADO A MOVEMENT */}
                        <Route path="movements" element={<Outlet />}>
                            <Route index element={<ListMovementPage />} />
                            <Route
                                path=":id"
                                element={<DetailMovementPage />}
                            />
                        </Route>
                        {/* RELACIONADO A CREDITS */}
                        <Route path="credits" element={<Outlet />}>
                            <Route index element={<CreditsPage />} />
                        </Route>
                        {/* CUALQUIER OTRA RUTA REDIRIGIRA AL LOGIN O AL DASHBOARD (SI HA INICIADO SESION) */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                )}
            </Routes>
        </BrowserRouter>
    );
};
