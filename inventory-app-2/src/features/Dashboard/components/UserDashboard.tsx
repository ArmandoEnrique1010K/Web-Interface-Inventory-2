import { TableContainer } from "@/components/TableContainer";
import type { UserDashboardItem } from "../schemas/items";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { formatPercentage } from "@/utils/formatPercentage";
import { handleFormatDateTimeText } from "@/utils/handleFormatDateTimeText";
import { LinkText } from "@/components/LinkText";

type Props = {
    data: UserDashboardItem;
    isError: boolean;
    isLoading: boolean;
};

export const UserDashboard = ({ data, isError, isLoading }: Props) => {
    return (
        <>
            <EntityDetailsLayout.Counter>
                <span>Ordenes pendientes:</span>
                <span className="text-lg">
                    {data.pendingDeliveryOrdersByUserCount}
                </span>
            </EntityDetailsLayout.Counter>
            <TableContainer
                title="Ordenes pendientes"
                headers={["Factura", "Fecha prioritaria", "Porcentaje"]}
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
                    </TableRowContainer>
                ))}
            </TableContainer>
        </>
    );
};
