import { ListProductPage } from "@/features/Product/pages/product/ListProductPage";
import { DetailsProductPage } from "@/features/Product/pages/product/DetailsProductPage";
import { NewProductPage } from "@/features/Product/pages/product/NewProductPage";
import { ListModelPage } from "@/features/Product/pages/model/ListModelPage";
import { DetailsModelPage } from "@/features/Product/pages/model/DetailsModelPage";
import { ListCategoryPage } from "@/features/Product/pages/category/ListCategoryPage";
import { NewCategoryPage } from "@/features/Product/pages/category/NewCategoryPage";
import { ListTypePage } from "@/features/Product/pages/type/ListTypePage";
import { NewTypePage } from "@/features/Product/pages/type/NewTypePage";
import { Navigate, Route, Routes } from "react-router-dom";
import { NavbarContainer } from "@/components/NavbarContainer";
import type { MenuItem } from "@/types";
import {
    DocumentDuplicateIcon,
    NewspaperIcon,
    RectangleGroupIcon,
    TagIcon,
} from "@heroicons/react/24/outline";
import { useAuthRole } from "@/hooks/useAuthRole";
import { ROLE_ADMIN } from "@/constants";

const productItems: MenuItem[] = [
    {
        label: "Productos",
        icon: <NewspaperIcon className="size-6" />,
        to: "/products",
    },
    {
        label: "Modelos",
        icon: <DocumentDuplicateIcon className="size-6" />,
        to: "/products/models",
    },
    {
        label: "Categorias",
        icon: <TagIcon className="size-6" />,
        to: "/products/categories",
    },
    {
        label: "Tipos",
        icon: <RectangleGroupIcon className="size-6" />,
        to: "/products/types",
    },
];

export default function ProductRoutes() {
    const { hasPermission } = useAuthRole();

    return (
        <NavbarContainer menuItems={productItems} keyword="products">
            <Routes>
                <Route index element={<ListProductPage />} />

                <Route path=":id" element={<DetailsProductPage />} />
                <Route path="models" element={<ListModelPage />} />
                {/* :productId es el ID del producto que corresponde al modelo */}
                <Route path="models/:modelId" element={<DetailsModelPage />} />
                <Route path="categories" element={<ListCategoryPage />} />
                <Route path="types" element={<ListTypePage />} />

                {hasPermission(ROLE_ADMIN) && (
                    <>
                        <Route path="new" element={<NewProductPage />} />

                        <Route
                            path="categories/new"
                            element={<NewCategoryPage />}
                        />
                        <Route path="types/new" element={<NewTypePage />} />
                    </>
                )}

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </NavbarContainer>
    );
}
