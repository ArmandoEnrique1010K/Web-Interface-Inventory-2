import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listAllMovements } from "../api/MovementAPI";
import { FiltersFormContainer } from "@/components/FiltersFormContainer";
import { InputTextFilter } from "@/ui/filters/InputTextFilter";
import { TableContainer } from "@/components/TableContainer";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { handleFormatDateTimeWithoutT } from "@/utils/handleFormatDateTime";
import { Paginator } from "@/components/Paginator";
import { EntityListLayout } from "@/layout/entity/EntityListLayout";
import type { MovementItem } from "../schemas/items";
import { MovementType } from "../components/MovementType";
import { InputDateTimeFilter } from "@/ui/filters/InputDateTimeFilter";
import { SelectOptionFilter } from "@/ui/filters/SelectOptionFilter";
import { movementTypeOptions } from "../data/movementTypeOptions";

export const ListMovementPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page") ?? 0);
    const minQuantity = searchParams.get("minQuantity") ?? "";
    const maxQuantity = searchParams.get("maxQuantity") ?? "";
    const minCreatedAt = searchParams.get("minCreatedAt") ?? "";
    const maxCreatedAt = searchParams.get("maxCreatedAt") ?? "";
    const movementType = searchParams.get("movementType") ?? "";
    const username = searchParams.get("username") ?? "";
    const keyword = searchParams.get("keyword") ?? "";

    const directionParam = searchParams.get("direction");
    const direction =
        directionParam === "asc" || directionParam === "desc"
            ? directionParam
            : undefined;

    const sortByParam = searchParams.get("sortBy");
    const sortBy =
        sortByParam === "id" ||
        sortByParam === "quantity" ||
        sortByParam === "createdAt" ||
        sortByParam === "movementType" ||
        sortByParam === "userFirstname" ||
        sortByParam === "modelName" ||
        sortByParam === "productName"
            ? sortByParam
            : undefined;

    const [form, setForm] = useState({
        page: page,
        minQuantity: minQuantity,
        maxQuantity: maxQuantity,
        minCreatedAt: minCreatedAt,
        maxCreatedAt: maxCreatedAt,
        movementType: movementType,
        username: username,
        keyword: keyword,
        direction: direction ?? "",
        sortBy: sortBy ?? "",
    });

    const { data, isError, isLoading } = useQuery({
        queryKey: [
            "movements",
            {
                minQuantity,
                maxQuantity,
                minCreatedAt,
                maxCreatedAt,
                movementType,
                username,
                keyword,
                page,
                direction,
                sortBy,
            },
        ],

        queryFn: () =>
            listAllMovements({
                page: page,
                minQuantity: minQuantity,
                maxQuantity: maxQuantity,
                minCreatedAt: minCreatedAt,
                maxCreatedAt: maxCreatedAt,
                movementType: movementType as MovementItem["movementType"],
                username: username,
                keyword: keyword,
                direction,
                sortBy,
            }),
    });

    const content = data?.content || [];
    // console.log(data)
    const movementOptions = useMemo(() => movementTypeOptions, []);

    return (
        <EntityListLayout>
            <EntityListLayout.Header title="Historial de movimientos" />
            <EntityListLayout.Content>
                <FiltersFormContainer
                    onSubmit={(e) => {
                        e.preventDefault();

                        const params = new URLSearchParams();

                        if (form.minQuantity)
                            params.set("minQuantity", form.minQuantity);
                        if (form.maxQuantity)
                            params.set("maxQuantity", form.maxQuantity);
                        if (form.minCreatedAt)
                            params.set("minCreatedAt", form.minCreatedAt);
                        if (form.maxCreatedAt)
                            params.set("maxCreatedAt", form.maxCreatedAt);
                        if (form.movementType)
                            params.set("movementType", form.movementType);
                        if (form.username)
                            params.set("username", form.username);
                        if (form.keyword) params.set("keyword", form.keyword);

                        if (form.sortBy) params.set("sortBy", form.sortBy);
                        if (form.direction)
                            params.set("direction", form.direction);

                        setSearchParams(params);
                    }}
                >
                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                        <InputTextFilter
                            name="minQuantity"
                            label="Cantidad minima tomada"
                            placeholder="Ej: 999"
                            type="number"
                            value={form.minQuantity}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    minQuantity: e.target.value,
                                }))
                            }
                        />
                        <InputTextFilter
                            name="maxQuantity"
                            label="Cantidad maxima tomada"
                            placeholder="Ej: 999999"
                            type="number"
                            value={form.maxQuantity}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    maxQuantity: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                        <InputDateTimeFilter
                            name="minCreatedAt"
                            label="Fecha minima"
                            value={form.minCreatedAt}
                            onChange={(value) =>
                                setForm((prev) => ({
                                    ...prev,
                                    minCreatedAt: value,
                                }))
                            }
                        />
                        <InputDateTimeFilter
                            name="maxCreatedAt"
                            label="Fecha maxima"
                            value={form.maxCreatedAt}
                            onChange={(value) =>
                                setForm((prev) => ({
                                    ...prev,
                                    maxCreatedAt: value,
                                }))
                            }
                        />
                    </div>
                    <InputTextFilter
                        name="username"
                        label="Usuario"
                        placeholder="Nombre, apellido, dni o correo"
                        type="text"
                        value={form.username}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                username: e.target.value,
                            }))
                        }
                    />

                    <InputTextFilter
                        name="keyword"
                        label="Producto"
                        placeholder="Nombre de producto o modelo"
                        type="text"
                        value={form.keyword}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                keyword: e.target.value,
                            }))
                        }
                    />

                    <SelectOptionFilter
                        name={"movementType"}
                        label={"Tipo de movimiento"}
                        options={movementOptions.map((movement) => {
                            return {
                                value: movement.value,
                                label: movement.label,
                            };
                        })}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                movementType: e.target.value,
                            }))
                        }
                        textInNullOption="Todos los movimientos"
                        value={form.movementType}
                    />
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
                                {
                                    value: "quantity",
                                    label: "Cantidad",
                                },
                                {
                                    value: "createdAt",
                                    label: "Fecha",
                                },
                                {
                                    value: "movementType",
                                    label: "Tipo de movimiento",
                                },
                                {
                                    value: "userFirstname",
                                    label: "Nombre del usuario",
                                },
                                {
                                    value: "modelName",
                                    label: "Nombre del modelo",
                                },
                                {
                                    value: "productName",
                                    label: "Nombre del producto",
                                },
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
                    headers={[
                        "ID",
                        "Movimiento",
                        "Fecha",
                        "Cantidad",
                        "Usuario",
                        "ID de modelo",
                    ]}
                    isLoading={isLoading}
                    isError={isError}
                    isEmpty={!content?.length}
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

                                    if (form.minQuantity)
                                        params.set(
                                            "minQuantity",
                                            form.minQuantity,
                                        );
                                    if (form.maxQuantity)
                                        params.set(
                                            "maxQuantity",
                                            form.maxQuantity,
                                        );
                                    if (form.minCreatedAt)
                                        params.set(
                                            "minCreatedAt",
                                            form.minCreatedAt,
                                        );
                                    if (form.maxCreatedAt)
                                        params.set(
                                            "maxCreatedAt",
                                            form.maxCreatedAt,
                                        );
                                    if (form.movementType)
                                        params.set(
                                            "movementType",
                                            form.movementType,
                                        );
                                    if (form.username)
                                        params.set("username", form.username);
                                    if (form.keyword)
                                        params.set("keyword", form.keyword);
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
                    {content?.map((movement) => {
                        return (
                            <TableRowContainer key={movement.id}>
                                <BaseTableCell data={movement.id} />

                                <BaseTableCell
                                    isCenter
                                    data={
                                        <MovementType
                                            type="url"
                                            movementId={movement.id}
                                            movementType={movement.movementType}
                                        />
                                    }
                                />
                                <BaseTableCell
                                    data={
                                        <div className="text-sm">
                                            {handleFormatDateTimeWithoutT(
                                                new Date(movement.createdAt),
                                            )}
                                        </div>
                                    }
                                />
                                <BaseTableCell data={movement.quantity} />
                                <BaseTableCell
                                    data={
                                        <div className="text-sm">
                                            {movement.userName}
                                        </div>
                                    }
                                />
                                <BaseTableCell
                                    data={
                                        <div className="text-sm">
                                            {movement.productName}{" "}
                                            {movement.modelName}
                                        </div>
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
