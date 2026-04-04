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
    const deliveryLineId = searchParams.get("deliveryLineId") ?? undefined;
    const modelId = searchParams.get("modelId") ?? undefined;
    const userId = searchParams.get("userId") ?? undefined;
    const stockLotReceiverId =
        searchParams.get("stockLotReceiverId") ?? undefined;

    const [form, setForm] = useState({
        page: page,
        minQuantity: minQuantity,
        maxQuantity: maxQuantity,
        minCreatedAt: minCreatedAt,
        maxCreatedAt: maxCreatedAt,
        movementType: movementType,
        username: username,
        keyword: keyword,
        deliveryLineId: deliveryLineId ?? "",
        modelId: modelId ?? "",
        userId: userId ?? "",
        stockLotReceiverId: stockLotReceiverId ?? "",
    });

    const { data, isError } = useQuery({
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
                deliveryLineId,
                modelId,
                userId,
                stockLotReceiverId,
                page,
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
                deliveryLineId: deliveryLineId,
                modelId: modelId,
                userId: userId,
                stockLotReceiverId: stockLotReceiverId,
            }),
    });

    // TODO: CONTINUAR AQUI LUEGO DE COMPLETAR EL MODULO ORDER
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
                        if (form.deliveryLineId)
                            params.set("deliveryLineId", form.deliveryLineId);
                        if (form.modelId) params.set("modelId", form.modelId);
                        if (form.userId) params.set("userId", form.userId);
                        if (form.stockLotReceiverId)
                            params.set(
                                "stockLotReceiverId",
                                form.stockLotReceiverId,
                            );

                        setSearchParams(params);
                    }}
                >
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

                    <InputDateTimeFilter
                        name={"minCreatedAt"}
                        label={"Fecha minima"}
                        value={form.minCreatedAt}
                        onChange={(value) =>
                            setForm((prev) => ({
                                ...prev,
                                minCreatedAt: value,
                            }))
                        }
                    />

                    <InputDateTimeFilter
                        name={"maxCreatedAt"}
                        label={"Fecha maxima"}
                        value={form.maxCreatedAt}
                        onChange={(value) =>
                            setForm((prev) => ({
                                ...prev,
                                maxCreatedAt: value,
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
                        textInNullOption="Todos los movimientos"
                        value={form.movementType}
                    />

                    {/* TODO: FALTA CAMPO PARA LA LINEA DE ENTREGA */}

                    {/* NOMBRE DE USUARIO */}
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

                    {/* NOMBRE DE PRODUCTO Y/O MODELO */}
                    <InputTextFilter
                        name="keyword"
                        label="Producto o modelo"
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

                    {/* CAMPO PARA ID DE MODELO */}

                    {/* CAMPO PARA NOMBRE DE USUARIO */}

                    {/* CAMPO PARA LOTE DE STOCK RECEPTOR */}
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
                                    if (form.deliveryLineId)
                                        params.set(
                                            "deliveryLineId",
                                            form.deliveryLineId,
                                        );
                                    if (form.modelId)
                                        params.set("modelId", form.modelId);
                                    if (form.userId)
                                        params.set("userId", form.userId);
                                    if (form.stockLotReceiverId)
                                        params.set(
                                            "stockLotReceiverId",
                                            form.stockLotReceiverId,
                                        );

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
                                    data={
                                        <MovementType
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
