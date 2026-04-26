import { TableContainer } from "@/components/TableContainer";
import type { UserDashboardItem } from "../schemas/items";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { formatPercentage } from "@/utils/formatPercentage";
import { handleFormatDateTimeText } from "@/utils/handleFormatDateTimeText";
import { LinkText } from "@/components/LinkText";
import { useState } from "react";
import { CounterGroup } from "../components/CounterGroup";
import { DeliveryOrderStatus } from "@/features/Order/components/deliveryOrder/DeliveryOrderStatus";

type Props = {
    data: UserDashboardItem;
    isError: boolean;
    isLoading: boolean;
};

export const UserDashboard = ({ data, isError, isLoading }: Props) => {
    const [items] = useState([
        {
            textSingular: "Orden pendiente",
            textPlural: "Ordenes pendientes",
            value: data.pendingDeliveryOrdersByUserCount,
            to: "/orders/my-orders?status=ORDER_PENDING",
        },
    ]);

    return (
        <>
            <CounterGroup items={items} />
            <TableContainer
                title="Ordenes pendientes"
                headers={[
                    "Factura",
                    "Fecha prioritaria",
                    "Completado al",
                    "Estado",
                ]}
                isError={isError}
                isLoading={isLoading}
                isEmpty={!data.pendingDeliveryOrdersByUser?.length}
            >
                {data.pendingDeliveryOrdersByUser.map((order) => (
                    <TableRowContainer key={order.id}>
                        <BaseTableCell
                            data={
                                <LinkText to={`/orders/my-orders/${order.id}`}>
                                    {order.batch}
                                </LinkText>
                            }
                        />
                        <BaseTableCell
                            data={
                                <>
                                    {
                                        handleFormatDateTimeText(
                                            new Date(order.priorityDate!),
                                        ).date
                                    }{" "}
                                    {
                                        handleFormatDateTimeText(
                                            new Date(order.priorityDate!),
                                        ).hour
                                    }
                                </>
                            }
                        />
                        <BaseTableCell
                            data={formatPercentage(order.percentage)}
                        />
                        <BaseTableCell
                            data={
                                <DeliveryOrderStatus
                                    deliveryOrderStatus={order.orderStatus}
                                />
                            }
                        />
                    </TableRowContainer>
                ))}
            </TableContainer>
        </>
    );
};
