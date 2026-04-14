import { NavbarContainer } from "@/components/NavbarContainer";
import type { MenuItem } from "@/types";
import { CubeIcon, TruckIcon } from "@heroicons/react/24/outline";
import { Navigate, Route, Routes } from "react-router-dom";
import { ListCompanyPage } from "@/features/StockLot/views/company/ListCompanyPage";
import { NewCompanyPage } from "@/features/StockLot/views/company/NewCompanyPage";
import { ListStockLotPage } from "@/features/StockLot/views/stocklot/ListStockLotPage";
import { NewStockLotPage } from "@/features/StockLot/views/stocklot/NewStockLotPage";
import { DetailsStockLotPage } from "@/features/StockLot/views/stocklot/DetailsStockLotPage";

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
    return (
        <NavbarContainer menuItems={stockLotsItems} keyword="stocklots">
            <Routes>
                <Route index element={<ListStockLotPage />} />
                <Route path="new" element={<NewStockLotPage />} />
                <Route path=":id" element={<DetailsStockLotPage />} />

                {/* RELACIONADO A COMPANIES */}
                <Route path="companies" element={<ListCompanyPage />} />
                <Route path="companies/new" element={<NewCompanyPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </NavbarContainer>
    );
}
