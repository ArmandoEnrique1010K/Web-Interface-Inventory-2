import { NavbarContainer } from "@/components/NavbarContainer";
import type { MenuItem } from "@/types";
import {
    ClipboardDocumentCheckIcon,
    ClipboardDocumentListIcon,
    ClipboardIcon,
} from "@heroicons/react/24/outline";
import { Navigate, Route, Routes } from "react-router-dom";
import { ListDeliveryOrderPage } from "@/features/Order/views/deliveryOrder/ListDeliveryOrderPage";
import { NewDeliveryOrderPage } from "@/features/Order/views/deliveryOrder/NewDeliveryOrderPage";
import { DetailsDeliveryOrderPage } from "@/features/Order/views/deliveryOrder/DetailsDeliveryOrderPage";
import { ListPendingDeliveryOrderPage } from "@/features/Order/views/deliveryOrder/ListPendingDeliveryOrderPage";
import { ListDeliveryOrderByCurrentUserPage } from "@/features/Order/views/deliveryOrder/ListDeliveryOrderByCurrentUserPage";
import { DetailsDeliveryLinePage } from "@/features/Order/views/deliveryLine/DetailsDeliveryLinePage";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { ROLE_ADMIN, ROLE_OPERATOR, ROLE_USER } from "@/constants";
import { useMemo } from "react";
import { hasPermission } from "@/utils/hasPermission";

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

const orderPermissions: Record<string, string[]> = {
    ROLE_USER: ["Mis ordenes"],
    ROLE_OPERATOR: ["Ordenes pendientes", "Mis ordenes"],
    ROLE_ADMIN: ["Todas las ordenes", "Ordenes pendientes", "Mis ordenes"],
};

export default function OrderRoutes() {
    const { userRole } = useSelector((state: RootState) => state.auth);

    // Items del menu que se van a filtrar de acuerdo al rol
    const filteredOrderItems = orderItems.filter((item) =>
        (orderPermissions[userRole] ?? []).includes(item.label),
    );

    // El string devuelto por esta funcion sera utilizado para redirigir al usuario
    const defaultRoute = useMemo(() => {
        if (userRole === ROLE_USER) return "my-orders";
        if (userRole === ROLE_OPERATOR) return "pending";
        return "";
    }, [userRole]);

    return (
        <NavbarContainer menuItems={filteredOrderItems} keyword="orders">
            <Routes>
                <Route
                    index
                    element={
                        // Este es el caso unico en el que se redirigira hacia la lista de las ordenes del usuario que ha iniciado sesion, si el usuario que inicio sesion tiene el rol de ROLE_USER
                        defaultRoute ? (
                            <Navigate to={defaultRoute} replace />
                        ) : (
                            <ListDeliveryOrderPage />
                        )
                    }
                />{" "}
                <Route
                    path=":deliveryOrderId/line/:deliveryLineId"
                    element={<DetailsDeliveryLinePage />}
                />
                <Route
                    path="pending/:deliveryOrderId/line/:deliveryLineId"
                    element={<DetailsDeliveryLinePage />}
                />
                <Route
                    path="my-orders/:deliveryOrderId/line/:deliveryLineId"
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
                {hasPermission(userRole, ROLE_OPERATOR) && (
                    <>
                        <Route
                            path="pending"
                            element={<ListPendingDeliveryOrderPage />}
                        />
                        <Route
                            path="pending/:id"
                            element={<DetailsDeliveryOrderPage />}
                        />
                        <Route
                            path=":id"
                            element={<DetailsDeliveryOrderPage />}
                        />
                    </>
                )}
                {hasPermission(userRole, ROLE_ADMIN) && (
                    <>
                        <Route path="new" element={<NewDeliveryOrderPage />} />
                    </>
                )}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </NavbarContainer>
    );
}
