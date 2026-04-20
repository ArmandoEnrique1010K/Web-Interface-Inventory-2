import { TableContainer } from "@/components/TableContainer";
import type { OperatorDashboardItem } from "../schemas/items";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { LinkText } from "@/components/LinkText";
import { handleFormatDateTimeText } from "@/utils/handleFormatDateTimeText";
import { formatPercentage } from "@/utils/formatPercentage";
type Props = {
    data: OperatorDashboardItem;
    isError: boolean;
    isLoading: boolean;
};

export const OperatorDashboard = ({ data, isError, isLoading }: Props) => {
    return (
        <>
            <div className="flex flex-row gap-4">
                <EntityDetailsLayout.Counter>
                    <span>Ordenes pendientes</span>
                    <span className="text-lg">
                        {data.quantityDeliveryOrdersPending}
                    </span>
                </EntityDetailsLayout.Counter>
                <EntityDetailsLayout.Counter>
                    <span>Productos con bajo stock</span>
                    <span className="text-lg">
                        {data.quantityLowStockModels}
                    </span>
                </EntityDetailsLayout.Counter>
                <EntityDetailsLayout.Counter>
                    <span>Productos a punto de caducar</span>
                    <span className="text-lg">
                        {data.quantityNearCaducityDateModels}
                    </span>
                </EntityDetailsLayout.Counter>
                <EntityDetailsLayout.Counter>
                    <span>Cantidad total de productos</span>
                    <span className="text-lg">{data.quantityModelsActive}</span>
                </EntityDetailsLayout.Counter>
            </div>
            <TableContainer
                title="Ordenes pendientes"
                headers={["Factura", "Fecha prioritaria", "Porcentaje"]}
                isError={isError}
                isLoading={isLoading}
                isEmpty={!data.pendingDeliveryOrders?.length}
            >
                {data.pendingDeliveryOrders.map((order) => (
                    <TableRowContainer key={order.id}>
                        <BaseTableCell
                            data={
                                <LinkText to={`/orders/pending/${order.id}`}>
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
            <TableContainer
                title="Productos con bajo stock"
                headers={["Nombre", "Caracteristica", "Cantidad"]}
                isError={isError}
                isLoading={isLoading}
                isEmpty={!data.lowStockModels?.length}
            >
                {data.lowStockModels.map((model) => (
                    <TableRowContainer key={model.id}>
                        <BaseTableCell
                            data={
                                <LinkText
                                    to={`/products/${model.productId}?modelId=${model.id}`}
                                >
                                    {model.productName} {model.modelName}
                                </LinkText>
                            }
                        />
                        <BaseTableCell
                            data={
                                <>
                                    {model.typeName} de {model.categoryName}
                                </>
                            }
                        />
                        <BaseTableCell data={model.totalQuantityAvailable} />
                    </TableRowContainer>
                ))}
            </TableContainer>

            <TableContainer
                title="Productos a punto de caducar"
                headers={["Nombre", "Caracteristica", "Cantidad"]}
                isError={isError}
                isLoading={isLoading}
                isEmpty={!data.expiringSoonModels?.length}
            >
                {data.expiringSoonModels.map((model) => (
                    <TableRowContainer key={model.id}>
                        <BaseTableCell
                            data={
                                <LinkText
                                    to={`/products/${model.productId}?modelId=${model.id}`}
                                >
                                    {model.productName} {model.modelName}
                                </LinkText>
                            }
                        />
                        <BaseTableCell
                            data={
                                <>
                                    {model.typeName} de {model.categoryName}
                                </>
                            }
                        />
                        <BaseTableCell data={model.totalQuantityAvailable} />
                    </TableRowContainer>
                ))}
            </TableContainer>

            <TableContainer
                title="Ultimos productos registrados"
                headers={["Nombre", "Caracteristica", "Cantidad"]}
                isError={isError}
                isLoading={isLoading}
                isEmpty={!data.recentModels?.length}
            >
                {data.recentModels.map((model) => (
                    <TableRowContainer key={model.id}>
                        <BaseTableCell
                            data={
                                <LinkText
                                    to={`/products/${model.productId}?modelId=${model.id}`}
                                >
                                    {model.productName} {model.modelName}
                                </LinkText>
                            }
                        />
                        <BaseTableCell
                            data={
                                <>
                                    {model.typeName} de {model.categoryName}
                                </>
                            }
                        />
                        <BaseTableCell data={model.totalQuantityAvailable} />
                    </TableRowContainer>
                ))}
            </TableContainer>
        </>
    );
};
