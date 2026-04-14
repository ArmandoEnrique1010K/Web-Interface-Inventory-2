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

export default function OrderRoutes() {
    return (
        <NavbarContainer menuItems={orderItems} keyword="orders">
            <Routes>
                <Route index element={<ListDeliveryOrderPage />} />
                <Route path=":id" element={<DetailsDeliveryOrderPage />} />

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

                <Route path="new" element={<NewDeliveryOrderPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </NavbarContainer>
    );
}
