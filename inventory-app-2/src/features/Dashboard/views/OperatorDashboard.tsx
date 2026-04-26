import { TableContainer } from "@/components/TableContainer";
import type { OperatorDashboardItem } from "../schemas/items";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { LinkText } from "@/components/LinkText";
import { handleFormatDateTimeText } from "@/utils/handleFormatDateTimeText";
import { formatPercentage } from "@/utils/formatPercentage";
import { useState } from "react";
import { CounterGroup } from "../components/CounterGroup";
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

        // TODO: REALIZAR UN AJUSTE EN LA ENTIDAD MODELS PARA AJUSTAR EL STOCK MINIMO
        {
            textSingular: "Modelo de producto con bajo stock",
            textPlural: "Modelos de productos con bajo stock",
            value: data.quantityLowStockModels,
            to: "/products/models",
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
