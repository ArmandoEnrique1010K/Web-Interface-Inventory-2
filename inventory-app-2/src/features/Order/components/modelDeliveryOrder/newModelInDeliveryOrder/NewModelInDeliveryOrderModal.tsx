import { BaseTableCell } from "@/components/BaseTableCell";
import { FiltersFormContainer } from "@/components/FiltersFormContainer";
import { Paginator } from "@/components/Paginator";
import { SearchCounter } from "@/components/SearchCounter";
import { TableContainer } from "@/components/TableContainer";
import { TableRowContainer } from "@/components/TableRowContainer";
import { listActiveModelsByName } from "@/features/Product/api/ModelAPI";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import { EntityListLayout } from "@/layout/entity/EntityListLayout";
import { InputTextFilter } from "@/ui/filters/InputTextFilter";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import type { SetURLSearchParams } from "react-router-dom";
import { NewModelInDeliveryOrderButton } from "../NewModelInDeliveryOrderButton";
import { Button } from "@/ui/Button";
import { XCircleIcon } from "@heroicons/react/24/outline";
import type { ModelDeliveryOrderItem } from "../../../schemas/items";
import type { ModelSearchItem } from "@/features/Product/schemas/items";

type Props = {
    setAddModelDeliveryOrderModalOpen: React.Dispatch<
        React.SetStateAction<boolean>
    >;
    deliveryOrderId: number;
    searchParams: URLSearchParams;
    setSearchParams: SetURLSearchParams;
    existingModels: ModelDeliveryOrderItem[]; // Nuevo prop
    currentModelId: number;
};

export const NewModelInDeliveryOrderModal = ({
    deliveryOrderId,
    setAddModelDeliveryOrderModalOpen,
    searchParams,
    setSearchParams,
    existingModels,
    currentModelId,
}: Props) => {
    const page = Number(searchParams.get("page") ?? 0);
    const keyword = searchParams.get("keyword") ?? "";

    const [form, setForm] = useState({
        page: page,
        keyword: keyword,
    });

    const { data, isError, isLoading } = useQuery({
        queryKey: ["products", { keyword, page }],

        queryFn: () =>
            listActiveModelsByName({
                page: page,
                keyword: keyword,
            }),
    });

    const content = data?.content || [];
    const generateCaracterist = (model: ModelSearchItem) => {
        if (+model.categoryId === 1) {
            return `${model.typeName}`;
        }

        if (+model.categoryId !== 1) {
            return `${model.typeName} de ${model.categoryName}`;
        }
    };

    // Al imprimir los modelos existentes se tiene una propiedad llamada "id", que es el ID de la relacion entre modelo y orden de entrega
    // [ ]
    // console.log(existingModels)

    return (
        <EntityFormLayout isCompact>
            <EntityListLayout isCompact>
                <EntityListLayout.Content>
                    <FiltersFormContainer
                        onSubmit={(e) => {
                            e.preventDefault();
                            const params = new URLSearchParams();
                            if (currentModelId)
                                params.set(
                                    "modelId",
                                    currentModelId.toString(),
                                );
                            if (form.keyword)
                                params.set("keyword", form.keyword);
                            setSearchParams(params);
                        }}
                    >
                        <InputTextFilter
                            name="keyword"
                            label="Nombre del producto o modelo"
                            placeholder="Buscar  por nombre"
                            type="text"
                            value={form.keyword}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    keyword: e.target.value,
                                }))
                            }
                        />
                    </FiltersFormContainer>
                    {
                        <TableContainer
                            headers={[
                                "ID",
                                "Nombre",
                                "Característica",
                                "Agregar",
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
                                            const params =
                                                new URLSearchParams();
                                            if (currentModelId)
                                                params.set(
                                                    "modelId",
                                                    currentModelId.toString(),
                                                );
                                            if (form.keyword)
                                                params.set(
                                                    "keyword",
                                                    form.keyword,
                                                );
                                            params.set("page", page.toString());

                                            setSearchParams(params);
                                        }}
                                    />
                                ) : null
                            }
                        >
                            {content?.map((model) => {
                                // Buscar la relación existente para este modelo
                                const existingRelation = existingModels.find(
                                    (existingModel) =>
                                        +existingModel.modelId === model.id,
                                );

                                return (
                                    <TableRowContainer key={model.id}>
                                        <BaseTableCell data={model.id} />
                                        <BaseTableCell
                                            data={`${model.productName} ${model.name}`}
                                        />
                                        <BaseTableCell
                                            data={
                                                <div className="text-sm">
                                                    {generateCaracterist(model)}
                                                </div>
                                            }
                                        />

                                        <BaseTableCell
                                            isCenter
                                            data={
                                                <NewModelInDeliveryOrderButton
                                                    modelId={model.id}
                                                    deliveryOrderId={
                                                        deliveryOrderId
                                                    }
                                                    existingModels={
                                                        existingModels
                                                    }
                                                    modelDeliveryOrderId={
                                                        existingRelation?.id
                                                    } // Pasar el ID de la relación o undefined
                                                />
                                            }
                                        />
                                    </TableRowContainer>
                                );
                            })}
                        </TableContainer>
                    }
                </EntityListLayout.Content>
            </EntityListLayout>
            <EntityFormLayout.Actions>
                <Button
                    type="button"
                    icon={<XCircleIcon />}
                    size="large"
                    text="Cancelar"
                    color="gray"
                    onClick={() => setAddModelDeliveryOrderModalOpen(false)}
                    showIconOnMobile={false}
                    showTextOnMobile
                    isLargeOnMobile
                    applyMinWidth
                />
            </EntityFormLayout.Actions>
        </EntityFormLayout>
    );
};
