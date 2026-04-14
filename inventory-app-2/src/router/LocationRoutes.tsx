import { Navigate, Route, Routes } from "react-router-dom";
import { ListLocationPage } from "@/features/Location/views/location/ListLocationPage";
import { NewLocationPage } from "@/features/Location/views/location/NewLocationPage";
import { ListRegionPage } from "@/features/Location/views/region/ListRegionPage";
import { NewRegionPage } from "@/features/Location/views/region/NewRegionPage";
import { ListSubregionPage } from "@/features/Location/views/subregion/ListSubregionPage";
import { NewSubregionPage } from "@/features/Location/views/subregion/NewSubregionPage";
import { NavbarContainer } from "@/components/NavbarContainer";
import type { MenuItem } from "@/types";
import { FlagIcon, MapIcon, MapPinIcon } from "@heroicons/react/24/outline";
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

export default function LocationRoutes() {
    return (
        <NavbarContainer menuItems={locationItems} keyword="locations">
            <Routes>
                <Route index element={<ListLocationPage />} />
                <Route path="new" element={<NewLocationPage />} />

                <Route path="regions" element={<ListRegionPage />} />
                <Route path="regions/new" element={<NewRegionPage />} />

                <Route path="subregions" element={<ListSubregionPage />} />
                <Route path="subregions/new" element={<NewSubregionPage />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </NavbarContainer>
    );
}
