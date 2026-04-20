import React from "react";
import type { AdminDashboardItem } from "../schemas/items";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { TableContainer } from "@/components/TableContainer";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { LinkText } from "@/components/LinkText";
import { handleFormatDateTimeText } from "@/utils/handleFormatDateTimeText";
import { formatPercentage } from "@/utils/formatPercentage";
import { MovementType } from "@/features/Movement/components/MovementType";

type Props = {
    data: AdminDashboardItem;
    isError: boolean;
    isLoading: boolean;
};

export const AdminDashboard = ({ data, isError, isLoading }: Props) => {
    return (
        <>
            <div className="lg:flex lg:flex-row gap-4">
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
                <EntityDetailsLayout.Counter>
                    <span>Movimientos realizados durante el dia</span>
                    <span className="text-lg">
                        {data.quantityMovementsToday}
                    </span>
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

            <TableContainer
                title="Movimientos realizados en el dia de hoy"
                headers={["Movimiento", "Producto", "Cantidad"]}
                isError={isError}
                isLoading={isLoading}
                isEmpty={!data.recentMovements?.length}
            >
                {data.recentMovements.map((movement) => (
                    <TableRowContainer key={movement.id}>
                        <BaseTableCell
                            data={
                                <MovementType
                                    type="url"
                                    movementId={movement.id}
                                    movementType={movement.movementType}
                                />
                            }
                        />
                        <BaseTableCell
                            data={
                                <>
                                    {movement.productName} {movement.modelName}
                                </>
                            }
                        />
                        <BaseTableCell data={movement.quantity} />
                    </TableRowContainer>
                ))}
            </TableContainer>
        </>
    );
};
