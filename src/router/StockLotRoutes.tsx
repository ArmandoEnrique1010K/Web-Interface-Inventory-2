import { NavbarContainer } from "@/components/NavbarContainer";
import type { MenuItem } from "@/types";
import { CubeIcon, TruckIcon } from "@heroicons/react/24/outline";
import { Navigate, Route, Routes } from "react-router-dom";
import { ListCompanyPage } from "@/features/StockLot/pages/company/ListCompanyPage";
import { NewCompanyPage } from "@/features/StockLot/pages/company/NewCompanyPage";
import { ListStockLotPage } from "@/features/StockLot/pages/stocklot/ListStockLotPage";
import { NewStockLotPage } from "@/features/StockLot/pages/stocklot/NewStockLotPage";
import { DetailsStockLotPage } from "@/features/StockLot/pages/stocklot/DetailsStockLotPage";
import { useAuthRole } from "@/hooks/useAuthRole";
import { ROLE_ADMIN } from "@/constants";

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
export default function StockLotRoutes() {
    const { hasPermission } = useAuthRole();

    return (
        <NavbarContainer menuItems={stockLotsItems} keyword="stocklots">
            <Routes>
                <Route index element={<ListStockLotPage />} />
                <Route path=":id" element={<DetailsStockLotPage />} />
                <Route path="new" element={<NewStockLotPage />} />

                <Route path="companies" element={<ListCompanyPage />} />

                {hasPermission(ROLE_ADMIN) && (
                    <>
                        <Route
                            path="companies/new"
                            element={<NewCompanyPage />}
                        />
                    </>
                )}

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </NavbarContainer>
    );
}
