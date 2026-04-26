import { useQuery } from "@tanstack/react-query";
import { listAllProducts } from "../../api/ProductAPI";
import { TableContainer } from "@/components/TableContainer";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { listAllCategories } from "../../api/CategoryAPI";
import { listAllTypes } from "../../api/TypeAPI";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Paginator } from "../../../../components/Paginator";
import { SearchCounter } from "@/components/SearchCounter";
import { FiltersFormContainer } from "@/components/FiltersFormContainer";
import { ButtonLink } from "@/ui/ButtonLink";
import { generateSizes } from "@/utils/generateSizes";
import { InputTextFilter } from "@/ui/filters/InputTextFilter";
import { SelectOptionFilter } from "@/ui/filters/SelectOptionFilter";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { EntityListLayout } from "@/layout/entity/EntityListLayout";
import { StatusProductButton } from "../../components/product/StatusProductButton";
import { type ProductItem } from "../../schemas/items";
import { EditProductButton } from "../../components/product/EditProductButton";
import { LinkText } from "@/components/LinkText";
import { useAuthRole } from "@/hooks/useAuthRole";
import { ROLE_ADMIN } from "@/constants";
import { StatusText } from "@/components/StatusText";
export const ListProductPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page") ?? 0);
    const name = searchParams.get("name") ?? "";
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const typeId = searchParams.get("typeId") ?? undefined;
    const statusParam = searchParams.get("status");
    const status = statusParam === null ? undefined : statusParam === "true";

    const directionParam = searchParams.get("direction");
    const direction =
        directionParam === "asc" || directionParam === "desc"
            ? directionParam
            : undefined;

    const sortByParam = searchParams.get("sortBy");
    const sortBy =
        sortByParam === "id" ||
        sortByParam === "name" ||
        sortByParam === "categoryName" ||
        sortByParam === "typeName"
            ? sortByParam
            : undefined;

    const [form, setForm] = useState({
        page: page,
        name: name,
        categoryId: categoryId ?? "",
        typeId: typeId ?? "",
        status: status === undefined ? "" : String(status),
        direction: direction ?? "",
        sortBy: sortBy ?? "",
    });

    // No se recomienda usar un hook useEffectEvent ni useEffect en React 19
    // Problema: useEffectEvent NO reemplaza a useEffect para sincronizar estado.
    // Estás copiando estado derivado → anti-pattern

    // useEffectEvent(() => {
    //     setForm({
    //         page: page,
    //         name: name,
    //         categoryId: categoryId ?? '',
    //         typeId: typeId ?? '',
    //         status: status === undefined ? '' : String(status),
    //     })
    // })
    const { hasPermission } = useAuthRole();

    const tableHeaders = hasPermission(ROLE_ADMIN)
        ? ["ID", "Nombre", "Característica", "Medidas", "Estado", "Editar"]
        : ["ID", "Nombre", "Característica", "Medidas", "Estado"];

    const { data, isError, isLoading } = useQuery({
        queryKey: [
            "products",
            { name, categoryId, typeId, status, page, direction, sortBy },
        ],

        queryFn: () =>
            listAllProducts({
                page: page,
                name: name,
                categoryId: categoryId,
                typeId: typeId,
                status: status,
                direction: direction,
                sortBy: sortBy,
            }),
    });

    const content = data?.content || [];
    // OBTENER LAS CARACTERISTICAS Y LOS TIPOS
    const { data: categoriesData } = useQuery({
        queryKey: ["categories"],
        queryFn: listAllCategories,
    });
    const { data: typesData } = useQuery({
        queryKey: ["types"],
        queryFn: listAllTypes,
    });

    const categories =
        categoriesData?.map((category) => ({
            value: category.id.toString(),
            label: category.name,
        })) || [];

    const types =
        typesData?.map((type) => ({
            value: type.id.toString(),
            label: type.name,
        })) || [];

    const generateCaracterist = (product: ProductItem) => {
        if (+product.categoryId === 1) {
            return `${product.typeName}`;
        }

        if (+product.categoryId !== 1) {
            return `${product.typeName} de ${product.categoryName}`;
        }
    };

    const statusOptions = [
        { value: "true", label: "Activos" },
        { value: "false", label: "Inactivos" },
    ];

    return (
        <EntityListLayout>
            <EntityListLayout.Header title="Productos" />
            {hasPermission(ROLE_ADMIN) && (
                <EntityListLayout.Header
                    actions={
                        <ButtonLink
                            icon={<PlusCircleIcon />}
                            size="large"
                            text="Nuevo producto"
                            to="/products/new"
                            color="blue"
                            showIconOnMobile={false}
                            showTextOnMobile
                        />
                    }
                />
            )}
            <EntityListLayout.Content>
                <FiltersFormContainer
                    onSubmit={(e) => {
                        e.preventDefault();

                        const params = new URLSearchParams();

                        if (form.name) params.set("name", form.name);
                        if (form.categoryId)
                            params.set("categoryId", form.categoryId);
                        if (form.typeId) params.set("typeId", form.typeId);
                        if (form.status !== "")
                            params.set("status", form.status);
                        if (form.sortBy) params.set("sortBy", form.sortBy);
                        if (form.direction)
                            params.set("direction", form.direction);

                        setSearchParams(params);
                    }}
                >
                    <InputTextFilter
                        name="name"
                        label="Nombre del producto"
                        placeholder="Ej: Afiche"
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                    />

                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                        <SelectOptionFilter
                            name="categoryId"
                            label="Categoría"
                            options={categories}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    categoryId: e.target.value,
                                }))
                            }
                            textInNullOption="Todas las categorias"
                            value={form.categoryId}
                        />
                        <SelectOptionFilter
                            name="typeId"
                            label="Tipo"
                            options={types}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    typeId: e.target.value,
                                }))
                            }
                            textInNullOption="Todos los tipos"
                            value={form.typeId}
                        />
                        <SelectOptionFilter
                            name="status"
                            label="Estado"
                            options={statusOptions}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    status: e.target.value,
                                }))
                            }
                            value={form.status}
                            textInNullOption="Todos los estados"
                        />
                    </div>
                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                        <SelectOptionFilter
                            name="sortBy"
                            label="Ordenar por"
                            value={form.sortBy}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    sortBy: e.target.value,
                                }))
                            }
                            options={[
                                { value: "id", label: "ID" },
                                { value: "name", label: "Nombre" },
                                { value: "categoryName", label: "Categoria" },
                                { value: "typeName", label: "Tipo" },
                            ]}
                        />

                        <SelectOptionFilter
                            name="direction"
                            label="Dirección"
                            value={form.direction}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    direction: e.target.value,
                                }))
                            }
                            options={[
                                { value: "desc", label: "Descendente" },
                                { value: "asc", label: "Ascendente" },
                            ]}
                        />
                    </div>
                </FiltersFormContainer>

                <TableContainer
                    headers={tableHeaders}
                    isError={isError}
                    isEmpty={!content?.length}
                    isLoading={isLoading}
                    itemsCounter={
                        data && (
                            <SearchCounter
                                totalElements={data.totalElements}
                                page={data.page}
                                size={data.size}
                                last={data.last}
                            />
                        )
                    }
                    paginator={
                        content?.length && data ? (
                            <Paginator
                                currentPage={data?.page}
                                totalPages={data?.totalPages}
                                isFirst={data?.first}
                                isLast={data?.last}
                                onPageChange={(page) => {
                                    setForm((prev) => ({
                                        ...prev,
                                        page,
                                    }));
                                    const params = new URLSearchParams();

                                    if (form.name)
                                        params.set("name", form.name);
                                    if (form.categoryId)
                                        params.set(
                                            "categoryId",
                                            form.categoryId,
                                        );
                                    if (form.typeId)
                                        params.set("typeId", form.typeId);
                                    if (form.status !== "")
                                        params.set("status", form.status);
                                    if (form.sortBy)
                                        params.set("sortBy", form.sortBy);
                                    if (form.direction)
                                        params.set("direction", form.direction);

                                    params.set("page", page.toString());

                                    setSearchParams(params);
                                }}
                            />
                        ) : null
                    }
                >
                    {content?.map((product) => {
                        return (
                            <TableRowContainer key={product.id}>
                                <BaseTableCell data={product.id} />
                                <BaseTableCell
                                    data={
                                        <div className="flex flex-col gap-1">
                                            <LinkText
                                                to={`/products/${product.id}`}
                                            >
                                                {product.name}
                                            </LinkText>

                                            <p className="text-xs">
                                                {product.quantityModels === 1
                                                    ? "1 modelo"
                                                    : `${product.quantityModels} modelos`}
                                            </p>
                                        </div>
                                    }
                                />
                                <BaseTableCell
                                    data={
                                        <div className="text-sm">
                                            {generateCaracterist(product)}
                                        </div>
                                    }
                                />
                                <BaseTableCell
                                    data={
                                        <div className="text-sm">
                                            {generateSizes(product)}
                                        </div>
                                    }
                                />

                                <BaseTableCell
                                    isCenter
                                    data={
                                        hasPermission(ROLE_ADMIN) ? (
                                            <StatusProductButton
                                                size="small"
                                                productId={product.id}
                                                isActive={product.status}
                                            />
                                        ) : (
                                            <StatusText
                                                value={product.status}
                                            />
                                        )
                                    }
                                />
                                {hasPermission(ROLE_ADMIN) && (
                                    <BaseTableCell
                                        isCenter
                                        data={
                                            //* SOLAMENTE SI UN PRODUCTO ESTA ACTIVO, PUEDE SER EDITADO
                                            product.status ? (
                                                <EditProductButton
                                                    productId={product.id}
                                                />
                                            ) : (
                                                <span className="text-xs">
                                                    ...
                                                </span>
                                            )
                                        }
                                    />
                                )}
                            </TableRowContainer>
                        );
                    })}
                </TableContainer>
            </EntityListLayout.Content>
        </EntityListLayout>
    );
};
