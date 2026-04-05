import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listAllDeliveryOrdersByClient } from "../../api/DeliveryOrderAPI";
import { EntityListLayout } from "@/layout/entity/EntityListLayout";
import { FiltersFormContainer } from "@/components/FiltersFormContainer";
import { InputTextFilter } from "@/ui/filters/InputTextFilter";
import { TableContainer } from "@/components/TableContainer";
import { SearchCounter } from "@/components/SearchCounter";
import { Paginator } from "@/components/Paginator";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { SelectOptionFilter } from "@/ui/filters/SelectOptionFilter";
import { InputDateTimeFilter } from "@/ui/filters/InputDateTimeFilter";
import { handleFormatDateTimeText } from "@/utils/handleFormatDateTimeText";
import type { DeliveryOrderItem } from "../../schemas/items";
import { deliveryOrderStatusOptions } from "../../data/deliveryOrderStatusOptions";
import { DeliveryOrderStatus } from "../../components/deliveryOrder/DeliveryOrderStatus";
import { LinkText } from "@/components/LinkText";

export const ListDeliveryOrderByCurrentUserPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page") ?? 0);
    const batch = searchParams.get("batch") ?? "";
    const startDate = searchParams.get("startDate") ?? "";
    const endDate = searchParams.get("endDate") ?? "";
    const status = searchParams.get("status") ?? "";
    const [form, setForm] = useState({
        page: page,
        batch,
        startDate,
        endDate,
        status: status === undefined ? "" : String(status),
    });

    const { data, isError, isLoading } = useQuery({
        queryKey: [
            "deliveryOrders",
            { batch, startDate, endDate, status, page },
        ],

        queryFn: () =>
            listAllDeliveryOrdersByClient({
                page: page,
                batch: batch,
                startDate: startDate,
                endDate: endDate,
                status: status as DeliveryOrderItem["orderStatus"],
            }),
    });

    const content = data?.content || [];

    const statusOptions = useMemo(() => deliveryOrderStatusOptions, []);
    //*: SI UN PRODUCTO ESTA DESACTIVADO PODRA SER VISTO EN LAS ORDENES DE ENTREGA POR UN USUARIO (QUE ES EL MISMO QUE HA INICIADO SESION)

    return (
        <EntityListLayout>
            <EntityListLayout.Header title="Mis ordenes de entrega" />
            <EntityListLayout.Content>
                <FiltersFormContainer
                    onSubmit={(e) => {
                        e.preventDefault();
                        const params = new URLSearchParams();

                        if (form.batch) params.set("batch", form.batch);
                        if (form.startDate)
                            params.set("startDate", form.startDate);
                        if (form.endDate) params.set("endDate", form.endDate);
                        if (form.status) params.set("status", form.status);

                        setSearchParams(params);
                    }}
                >
                    <InputTextFilter
                        name="batch"
                        label="Código de orden de entrega"
                        placeholder="Ej: 10001"
                        type="text"
                        value={form.batch}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                batch: e.target.value,
                            }))
                        }
                    />
                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                        <InputDateTimeFilter
                            name="startDate"
                            label="Fecha prioritaria minima de entrega"
                            value={form.startDate}
                            onChange={(value) =>
                                setForm((prev) => ({
                                    ...prev,
                                    startDate: value,
                                }))
                            }
                        />

                        <InputDateTimeFilter
                            name="endDate"
                            label="Fecha prioritaria maxima de entrega"
                            value={form.endDate}
                            onChange={(value) =>
                                setForm((prev) => ({ ...prev, endDate: value }))
                            }
                        />
                    </div>

                    {/* <InputDateFilter
                        name='startDate'
                        label='Fecha minima de creación'
                        value={form.startDate}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, startDate: e.target.value }))
                        }
                    />
                    <InputDateFilter
                        name='endDate'
                        label='Fecha maxima de creación'
                        value={form.endDate}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, endDate: e.target.value }))
                        }
                    /> */}
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
                        textInNullOption="Todos los estados"
                        value={form.status}
                    />
                </FiltersFormContainer>

                <TableContainer
                    headers={[
                        "ID",
                        "# de factura",
                        "Fecha prioritaria",
                        "Estado",
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

                                    if (form.batch)
                                        params.set("batch", form.batch);

                                    if (form.startDate)
                                        params.set("startDate", form.startDate);
                                    if (form.endDate)
                                        params.set("endDate", form.endDate);

                                    if (form.status !== "")
                                        params.set("status", form.status);

                                    params.set("page", page.toString());

                                    setSearchParams(params);
                                }}
                            />
                        ) : null
                    }
                >
                    {content.map((order) => {
                        return (
                            <TableRowContainer key={order.id}>
                                <BaseTableCell data={order.id} />
                                <BaseTableCell
                                    data={
                                        <LinkText
                                            to={`/orders/my-orders/${order.id}`}
                                        >
                                            {order.batch}
                                        </LinkText>
                                    }
                                />
                                <BaseTableCell
                                    data={
                                        order.priorityDate ? (
                                            <span>
                                                <span>
                                                    {
                                                        handleFormatDateTimeText(
                                                            new Date(
                                                                order.priorityDate,
                                                            ),
                                                        ).date
                                                    }{" "}
                                                    {
                                                        handleFormatDateTimeText(
                                                            new Date(
                                                                order.priorityDate,
                                                            ),
                                                        ).hour
                                                    }
                                                </span>
                                            </span>
                                        ) : (
                                            "Sin fecha"
                                        )
                                    }
                                />
                                <BaseTableCell
                                    isCenter
                                    data={
                                        <DeliveryOrderStatus
                                            deliveryOrderStatus={
                                                order.orderStatus
                                            }
                                        />
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
