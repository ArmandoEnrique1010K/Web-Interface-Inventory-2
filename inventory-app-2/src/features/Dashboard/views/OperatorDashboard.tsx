import { TableContainer } from "@/components/TableContainer";
import type { OperatorDashboardItem } from "../schemas/items";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { LinkText } from "@/components/LinkText";
import { handleFormatDateTimeText } from "@/utils/handleFormatDateTimeText";
import { formatPercentage } from "@/utils/formatPercentage";
import { useState } from "react";
import { CounterGroup } from "../components/CounterGroup";
import { handleFormatDate } from "@/utils/handleFormatDate";
import { DeliveryOrderStatus } from "@/features/Order/components/deliveryOrder/DeliveryOrderStatus";
type Props = {
    data: OperatorDashboardItem;
    isError: boolean;
    isLoading: boolean;
};

export const OperatorDashboard = ({ data, isError, isLoading }: Props) => {
    const [items] = useState([
        {
            textSingular: "Orden pendiente",
            textPlural: "Ordenes pendientes",
            value: data.quantityDeliveryOrdersPending,
            to: "/orders/pending",
        },

        {
            textSingular: "Modelo de producto con bajo stock",
            textPlural: "Modelos de productos con bajo stock",
            value: data.quantityLowStockModels,
            to: "/products/models?lowStock=true&sortBy=totalQuantityAvailable&direction=asc",
        },
        {
            textSingular: "Modelo de producto a punto de caducar",
            textPlural: "Modelos de productos a punto de caducar",
            value: data.quantityNearCaducityDateModels,
            to: "/products/models?sortBy=caducityDate&direction=desc",
        },
        {
            textSingular: "Modelo de producto en el sistema",
            textPlural: "Modelos de productos en el sistema",
            value: data.quantityModelsActive,
            to: "/products/models?status=true&sortBy=entryDate&direction=desc",
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
                    "Cliente",
                    "Completado al",
                    "Estado",
                ]}
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
                                order.priorityDate ? (
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
                                ) : (
                                    <div>No hay prioridad</div>
                                )
                            }
                        />{" "}
                        <BaseTableCell
                            data={
                                <>
                                    {order.userClientFirstname}{" "}
                                    {order.userClientLastname}
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
            <TableContainer
                title="Productos con bajo stock"
                headers={["Nombre", "Caracteristica", "Cantidad disponible"]}
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
                        <BaseTableCell
                            data={
                                <>
                                    <div>{model.totalQuantityAvailable}</div>
                                    <div className="text-sm text-gray-500">
                                        Minimo: {model.minimumAvailableQuantity}
                                    </div>
                                </>
                            }
                        />
                    </TableRowContainer>
                ))}
            </TableContainer>

            <TableContainer
                title="Productos a punto de caducar"
                headers={[
                    "Nombre",
                    "Caracteristica",
                    "Fecha de caducidad",
                    "Cantidad",
                ]}
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
                        <BaseTableCell
                            data={handleFormatDate(
                                new Date(model.caducityDate),
                            )}
                        />
                        <BaseTableCell data={model.totalQuantityAvailable} />
                    </TableRowContainer>
                ))}
            </TableContainer>

            <TableContainer
                title="Ultimos productos registrados"
                headers={[
                    "Nombre",
                    "Caracteristica",
                    "Fecha de entrada",
                    "Cantidad",
                ]}
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
                        <BaseTableCell
                            data={handleFormatDate(new Date(model.entryDate))}
                        />
                        <BaseTableCell data={model.totalQuantityAvailable} />
                    </TableRowContainer>
                ))}
            </TableContainer>
        </>
    );
};
