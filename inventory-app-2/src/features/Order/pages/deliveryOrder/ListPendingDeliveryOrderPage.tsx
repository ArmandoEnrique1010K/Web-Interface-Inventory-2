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

export const ListPendingDeliveryOrderPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page") ?? 0);
    const batch = searchParams.get("batch") ?? "";
    const startDate = searchParams.get("startDate") ?? "";
    const endDate = searchParams.get("endDate") ?? "";
    const userClientName = searchParams.get("userClientName") ?? "";
    const [form, setForm] = useState({
        page: page,
        batch,
        startDate,
        endDate,
        userClientName,
    });

    const { data, isError, isLoading } = useQuery({
        queryKey: [
            "deliveryOrders",
            { batch, startDate, endDate, userClientName, page },
        ],

        queryFn: () =>
            listAllPendingDeliveryOrders({
                page: page,
                batch: batch,
                startDate: startDate,
                endDate: endDate,
                userClientName: userClientName,
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
                                    data={
                                        <div className="text-sm">
                                            {order.userClientFullname}
                                        </div>
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
