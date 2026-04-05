import { useQuery } from "@tanstack/react-query";
import { TableContainer } from "@/components/TableContainer";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { listAllCategories } from "../../api/CategoryAPI";
import { listAllTypes } from "../../api/TypeAPI";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Paginator } from "../../../../components/Paginator";
import { useMediaQuery } from "react-responsive";
import { SearchCounter } from "@/components/SearchCounter";
import { FiltersFormContainer } from "@/components/FiltersFormContainer";
import { InputTextFilter } from "@/ui/filters/InputTextFilter";
import { SelectOptionFilter } from "@/ui/filters/SelectOptionFilter";
import { listAllModels } from "../../api/ModelAPI";
import { InputDateFilter } from "@/ui/filters/InputDateFilter";
import { StatusModelButton } from "../../components/model/StatusModelButton";
import { EntityListLayout } from "@/layout/entity/EntityListLayout";
import { EditModelButton } from "../../components/model/EditModelButton";
import { LinkText } from "@/components/LinkText";

export const ListModelPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page") ?? 0);
    const keyword = searchParams.get("keyword") ?? "";
    const minStock = searchParams.get("minStock") ?? "";
    const maxStock = searchParams.get("maxStock") ?? "";
    const minEntryDate = searchParams.get("minEntryDate") ?? "";
    const maxEntryDate = searchParams.get("maxEntryDate") ?? "";
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const typeId = searchParams.get("typeId") ?? undefined;
    const statusParam = searchParams.get("status");
    const status = statusParam === null ? undefined : statusParam === "true";

    const [form, setForm] = useState({
        page: page,
        keyword: keyword,
        minStock: minStock,
        maxStock: maxStock,
        minEntryDate: minEntryDate,
        maxEntryDate: maxEntryDate,
        categoryId: categoryId ?? "",
        typeId: typeId ?? "",
        status: status === undefined ? "" : String(status),
    });

    const { data, isError, isLoading } = useQuery({
        queryKey: [
            "models",
            {
                keyword,
                minStock,
                maxStock,
                minEntryDate,
                maxEntryDate,
                categoryId,
                typeId,
                status,
                page,
            },
        ],

        queryFn: () =>
            listAllModels({
                page: page,
                keyword: keyword,
                minStock: minStock,
                maxStock: maxStock,
                minEntryDate: minEntryDate,
                maxEntryDate: maxEntryDate,
                categoryId: categoryId,
                typeId: typeId,
                status: status,
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

    const statusOptions = [
        { value: "true", label: "Activos" },
        { value: "false", label: "Inactivos" },
    ];

    const isSmallScreen = useMediaQuery({ query: "(max-width: 920px)" });
    const isExtraSmallScreen = useMediaQuery({ query: "(max-width: 720px)" });

    return (
        <EntityListLayout>
            <EntityListLayout.Header title="Modelos"></EntityListLayout.Header>
            <EntityListLayout.Content>
                <FiltersFormContainer
                    onSubmit={(e) => {
                        e.preventDefault();

                        const params = new URLSearchParams();

                        if (form.keyword) params.set("keyword", form.keyword);
                        if (form.minStock)
                            params.set("minStock", form.minStock.toString());
                        if (form.maxStock)
                            params.set("maxStock", form.maxStock.toString());
                        if (form.minEntryDate)
                            params.set("minEntryDate", form.minEntryDate);
                        if (form.maxEntryDate)
                            params.set("maxEntryDate", form.maxEntryDate);
                        if (form.categoryId)
                            params.set("categoryId", form.categoryId);
                        if (form.typeId) params.set("typeId", form.typeId);
                        if (form.status !== "")
                            params.set("status", form.status);

                        setSearchParams(params);
                    }}
                >
                    <InputTextFilter
                        name="keyword"
                        label="Nombre del modelo o producto"
                        placeholder="Buscar modelos y/o productos por nombre"
                        type="text"
                        value={form.keyword}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                keyword: e.target.value,
                            }))
                        }
                    />
                    <div
                        className={`flex ${isExtraSmallScreen ? "flex-col gap-4" : "flex-row gap-4"}`}
                    >
                        <InputTextFilter
                            name="minStock"
                            label="Stock mínimo"
                            placeholder="Stock mínimo"
                            type="number"
                            value={form.minStock.toString()}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    minStock: e.target.value,
                                }))
                            }
                        />

                        <InputTextFilter
                            name="maxStock"
                            label="Stock máximo"
                            placeholder="Stock máximo"
                            type="number"
                            value={form.maxStock.toString()}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    maxStock: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div
                        className={`flex ${isExtraSmallScreen ? "flex-col gap-4" : "flex-row gap-4"}`}
                    >
                        <InputDateFilter
                            name="minEntryDate"
                            label="Fecha minima de entrada"
                            value={form.minEntryDate}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    minEntryDate: e.target.value,
                                }))
                            }
                        />
                        <InputDateFilter
                            name="maxEntryDate"
                            label="Fecha máxima de entrada"
                            value={form.maxEntryDate}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    maxEntryDate: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div
                        className={`flex ${isSmallScreen ? "flex-col gap-4" : "flex-row gap-4"}`}
                    >
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
                </FiltersFormContainer>

                <TableContainer
                    headers={[
                        "ID",
                        "Nombre",
                        "Cantidad disponible",
                        "Fechas",
                        "Estado",
                        "Editar",
                    ]}
                    isLoading={isLoading}
                    isError={isError}
                    isEmpty={!content?.length}
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

                                    if (form.keyword)
                                        params.set("keyword", form.keyword);

                                    if (form.minStock)
                                        params.set(
                                            "minStock",
                                            form.minStock.toString(),
                                        );
                                    if (form.maxStock)
                                        params.set(
                                            "maxStock",
                                            form.maxStock.toString(),
                                        );
                                    if (form.minEntryDate)
                                        params.set(
                                            "minEntryDate",
                                            form.minEntryDate,
                                        );
                                    if (form.maxEntryDate)
                                        params.set(
                                            "maxEntryDate",
                                            form.maxEntryDate,
                                        );

                                    if (form.categoryId)
                                        params.set(
                                            "categoryId",
                                            form.categoryId,
                                        );
                                    if (form.typeId)
                                        params.set("typeId", form.typeId);
                                    if (form.status !== "")
                                        params.set("status", form.status);

                                    params.set("page", page.toString());

                                    setSearchParams(params);
                                }}
                            />
                        ) : null
                    }
                >
                    {content?.map((model) => {
                        return (
                            <TableRowContainer key={model.id}>
                                <BaseTableCell data={model.id} />
                                <BaseTableCell
                                    data={
                                        <div className="flex flex-col gap-1">
                                            <LinkText
                                                to={`/products/models/${model.id}`}
                                            >
                                                {model.name}
                                            </LinkText>

                                            <div>
                                                <div className="text-sm text-gray-500">
                                                    {model.productName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {model.categoryName} -{" "}
                                                    {model.typeName}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                />
                                <BaseTableCell
                                    data={model.totalQuantityAvailable}
                                />

                                <BaseTableCell
                                    data={
                                        <div className="flex flex-col text-sm">
                                            <div>
                                                Entrada: {model.entryDate}
                                            </div>
                                            <div>
                                                Caducidad: {model.caducityDate}
                                            </div>
                                        </div>
                                    }
                                />

                                <BaseTableCell
                                    isCenter
                                    data={
                                        <StatusModelButton
                                            size="small"
                                            modelId={model.id}
                                            productId={model.productId}
                                            value={
                                                model.status
                                                    ? "Activo"
                                                    : "Inactivo"
                                            }
                                        />
                                    }
                                />

                                <BaseTableCell
                                    isCenter
                                    data={
                                        //* SOLAMENTE SI UN PRODUCTO ESTA ACTIVO, PUEDE SER EDITADO
                                        model.status === true && (
                                            <EditModelButton
                                                modelId={model.id}
                                            />
                                        )
                                    }
                                />
                            </TableRowContainer>
                        );
                    })}
                </TableContainer>
            </EntityListLayout.Content>
        </EntityListLayout>
    );
};
