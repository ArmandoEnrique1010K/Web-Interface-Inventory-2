import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { lazy, useEffect } from "react";
import { loadUserSession } from "@/store/authThunks";
import { CreditsPage } from "@/features/Credits/views/CreditsPage";
import { LazyLoader } from "./LazyLoader";
import { LoginForm } from "@/features/Auth/views/LoginForm";
import { RestoreUserPasswordForm } from "@/features/Auth/views/RestoreUserPasswordForm";
import { ValidateUserTokenForm } from "@/features/Auth/views/ValidateUserTokenForm";
import { UpdateUserPasswordForm } from "@/features/Auth/views/UpdateUserPasswordForm";
import { hasPermission } from "@/utils/hasPermission";

// Layouts
const AuthLayout = lazy(() => import("@/layout/app/AuthLayout"));
const DashboardLayout = lazy(() => import("@/layout/app/DashboardLayout"));

// Grupo de rutas
const ProductRoutes = lazy(() => import("./ProductRoutes"));
const UserRoutes = lazy(() => import("./UserRoutes"));
const LocationRoutes = lazy(() => import("./LocationRoutes"));
const ProfileRoutes = lazy(() => import("./ProfileRoutes"));
const StockLotRoutes = lazy(() => import("./StockLotRoutes"));
const OrderRoutes = lazy(() => import("./OrderRoutes"));
const MovementRoutes = lazy(() => import("./MovementRoutes"));

export const GeneralRouter = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { userRole } = useSelector((state: RootState) => state.auth);

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

                        {/* RELACIONADO A ORDENES */}
                        <Route
                            path="orders/*"
                            element={
                                <LazyLoader>
                                    <OrderRoutes />
                                </LazyLoader>
                            }
                        ></Route>

                        {/* RELACIONADO A PRODUCTS */}
                        {hasPermission(userRole, "ROLE_OPERATOR") && (
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
                        )}

                        {/* RELACIONADO A STOCKLOT */}
                        {hasPermission(userRole, "ROLE_OPERATOR") && (
                            <Route
                                path="stocklots/*"
                                element={
                                    <LazyLoader>
                                        <StockLotRoutes />
                                    </LazyLoader>
                                }
                            ></Route>
                        )}

                        {/* RELACIONADO A MOVEMENT */}
                        {hasPermission(userRole, "ROLE_ADMIN") && (
                            <Route
                                path="movements/*"
                                element={
                                    <LazyLoader>
                                        <MovementRoutes />
                                    </LazyLoader>
                                }
                            ></Route>
                        )}

                        {/* RELACIONADO A USER */}
                        {/* <Route path="users" element={<Outlet />}>
                            <Route index element={<ListUserPage />} />
                            <Route path="new" element={<RegisterUserPage />} />
                        </Route> */}
                        {hasPermission(userRole, "ROLE_ADMIN") && (
                            <Route
                                path="users/*"
                                element={
                                    <LazyLoader>
                                        <UserRoutes />
                                    </LazyLoader>
                                }
                            />
                        )}

                        {/* RELACIONADO A LOCATION */}
                        {hasPermission(userRole, "ROLE_OPERATOR") && (
                            <Route
                                path="locations/*"
                                element={
                                    <LazyLoader>
                                        <LocationRoutes />
                                    </LazyLoader>
                                }
                            ></Route>
                        )}

                        {/* RELACIONADO A CREDITS */}
                        <Route path="credits" element={<Outlet />}>
                            <Route index element={<CreditsPage />} />
                        </Route>

                        {/* RELACIONADO A PROFILE */}
                        <Route
                            path="profile/*"
                            element={
                                <LazyLoader>
                                    <ProfileRoutes />
                                </LazyLoader>
                            }
                        ></Route>

                        {/* CUALQUIER OTRA RUTA REDIRIGIRA AL LOGIN O AL DASHBOARD (SI HA INICIADO SESION) */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                )}
            </Routes>
        </BrowserRouter>
    );
};
