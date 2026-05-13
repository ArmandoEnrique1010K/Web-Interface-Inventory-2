import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listAllPendingDeliveryOrders } from "../../api/DeliveryOrderAPI";
import { EntityListLayout } from "@/layout/entity/EntityListLayout";
import { FiltersFormContainer } from "@/components/FiltersFormContainer";
import { InputTextFilter } from "@/ui/filters/InputTextFilter";
import { TableContainer } from "@/components/TableContainer";
import { SearchCounter } from "@/components/SearchCounter";
import { Paginator } from "@/components/Paginator";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { InputDateTimeFilter } from "@/ui/filters/InputDateTimeFilter";
import { handleFormatDateTimeText } from "@/utils/handleFormatDateTimeText";
import { DeliveryOrderStatus } from "../../components/deliveryOrder/DeliveryOrderStatus";
import { LinkText } from "@/components/LinkText";
import { SelectOptionFilter } from "@/ui/filters/SelectOptionFilter";

export const ListPendingDeliveryOrderPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page") ?? 0);
    const batch = searchParams.get("batch") ?? "";
    const startDate = searchParams.get("startDate") ?? "";
    const endDate = searchParams.get("endDate") ?? "";
    const userClientName = searchParams.get("userClientName") ?? "";

    const directionParam = searchParams.get("direction");
    const direction =
        directionParam === "asc" || directionParam === "desc"
            ? directionParam
            : undefined;

    const sortByParam = searchParams.get("sortBy");
    const sortBy =
        sortByParam === "id" ||
        sortByParam === "batch" ||
        sortByParam === "limitDate" ||
        sortByParam === "priorityDate" ||
        sortByParam === "userClientFirstname"
            ? sortByParam
            : undefined;

    const [form, setForm] = useState({
        page: page,
        batch,
        startDate,
        endDate,
        userClientName,
        direction: direction ?? "",
        sortBy: sortBy ?? "",
    });

    const { data, isError, isLoading } = useQuery({
        queryKey: [
            "deliveryOrders",
            {
                batch,
                startDate,
                endDate,
                userClientName,
                page,
                direction,
                sortBy,
            },
        ],

        queryFn: () =>
            listAllPendingDeliveryOrders({
                page: page,
                batch: batch,
                startDate: startDate,
                endDate: endDate,
                userClientName: userClientName,
                direction,
                sortBy,
            }),
    });

    const content = data?.content || [];

    return (
        <EntityListLayout>
            <EntityListLayout.Header title="Ordenes de entrega pendientes"></EntityListLayout.Header>
            {/* <RoleGuard requiredRole={ROLE_ADMIN}>
                <EntityListLayout.Header
                    actions={
                        <ButtonLink
                            icon={<PlusCircleIcon />}
                            size="large"
                            text="Nueva orden"
                            to="/orders/new"
                            color="blue"
                            showIconOnMobile={false}
                            showTextOnMobile
                        />
                    }
                ></EntityListLayout.Header>
            </RoleGuard> */}

            <EntityListLayout.Content>
                <FiltersFormContainer
                    onSubmit={(e) => {
                        e.preventDefault();
                        const params = new URLSearchParams();

                        if (form.batch) params.set("batch", form.batch);
                        if (form.startDate)
                            params.set("startDate", form.startDate);
                        if (form.endDate) params.set("endDate", form.endDate);
                        if (form.userClientName)
                            params.set("userClientName", form.userClientName);
                        if (form.sortBy) params.set("sortBy", form.sortBy);
                        if (form.direction)
                            params.set("direction", form.direction);

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
                    <InputTextFilter
                        name="userClientName"
                        label="Nombre del cliente"
                        placeholder="Nombre y/o apellido"
                        type="text"
                        value={form.userClientName}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                userClientName: e.target.value,
                            }))
                        }
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
                                    value: "batch",
                                    label: "Factura",
                                },
                                {
                                    value: "limitDate",
                                    label: "Fecha limite de entrega",
                                },
                                {
                                    value: "priorityDate",
                                    label: "Fecha prioritaria de entrega",
                                },
                                {
                                    value: "userClientFirstname",
                                    label: "Nombre del cliente",
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
                        "# de factura",
                        "Fecha prioritaria",
                        "Cliente",
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

                                    if (form.userClientName)
                                        params.set(
                                            "userClientName",
                                            form.userClientName,
                                        );
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
                    {content.map((order) => {
                        return (
                            <TableRowContainer key={order.id}>
                                <BaseTableCell data={order.id} />
                                <BaseTableCell
                                    data={
                                        <LinkText
                                            to={`/orders/pending/${order.id}`}
                                        >
                                            {order.batch}
                                        </LinkText>
                                    }
                                />
                                <BaseTableCell
                                    data={
                                        <>
                                            {order.priorityDate ? (
                                                <div>
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
                                                </div>
                                            ) : (
                                                "Sin fecha"
                                            )}

                                            {order.limitDate ? (
                                                <div>
                                                    <span className="text-sm text-gray-500">
                                                        Fecha limite:{" "}
                                                        {
                                                            handleFormatDateTimeText(
                                                                new Date(
                                                                    order.limitDate,
                                                                ),
                                                            ).date
                                                        }{" "}
                                                        {
                                                            handleFormatDateTimeText(
                                                                new Date(
                                                                    order.limitDate,
                                                                ),
                                                            ).hour
                                                        }
                                                    </span>
                                                </div>
                                            ) : (
                                                "Sin fecha"
                                            )}
                                        </>
                                    }
                                />
                                <BaseTableCell
                                    data={<div>{order.userClientFullname}</div>}
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
