import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getDeliveryLine } from "../../api/DeliveryLineAPI";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { PanelContainer } from "@/components/containers/PanelContainer";
import { handleFormatDateTimeWithoutT } from "../../../../utils/handleFormatDateTime";
import { handleFormatDateTimeText } from "@/utils/handleFormatDateTimeText";
import { useEffect } from "react";
import { getStockLotsByDeliveryLine } from "../../api/StockLotsDeliveryLineAPI";
import { TableContainer } from "@/components/TableContainer";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { ButtonLink } from "@/ui/ButtonLink";
import { SendDeliveryLineButton } from "../../components/deliveryLine/SendDeliveryLineButton";
import { CancelDeliveryLineButton } from "../../components/deliveryLine/CancelDeliveryLineButton";
import { MissingDeliveryLineButton } from "../../components/deliveryLine/MissingDeliveryLineButton";
import type { DeliveryLineDetailsItem } from "../../schemas/items";
import { AllocateDeliveryLineButton } from "../../components/deliveryLine/AllocateDeliveryLineButton";
import { LostDeliveryLineButton } from "../../components/deliveryLine/LostDeliveryLineButton";
import { ReturnDeliveryLineButton } from "../../components/deliveryLine/ReturnDeliveryLineButton";
import { EditDeliveryLineButton } from "../../components/deliveryLine/EditDeliveryLineButton";
import { DeliveryLineStatus } from "../../components/deliveryLine/DeliveryLineStatus";
import { LoadingView } from "@/views/LoadingView";
import { Error } from "@/views/Error";
import { ROLE_ADMIN, ROLE_OPERATOR } from "@/constants";
import { useAuthRole } from "@/hooks/useAuthRole";

export const DetailsDeliveryLinePage = () => {
    const {
        deliveryLineId: deliveryLineStr,
        deliveryOrderId: deliveryOrderStr,
    } = useParams();

    const deliveryLineId = +deliveryLineStr!;
    const deliveryOrderId = +deliveryOrderStr!;

    const navigate = useNavigate();
    const { pathname } = useLocation();

    const from = pathname.includes("pending")
        ? "pending"
        : pathname.includes("my-orders")
          ? "my-orders"
          : "";

    const { data, isLoading, isError } = useQuery<DeliveryLineDetailsItem>({
        queryKey: ["deliveryLine", deliveryLineId],
        queryFn: () => getDeliveryLine(deliveryLineId!),
        enabled: !!deliveryLineId,
        retry: 0,
    });

    // Obtener las cantidades tomadas
    const { hasPermission } = useAuthRole();

    const canViewStockLots = hasPermission(ROLE_OPERATOR);

    //* ESTE ENDPOINT SOLAMENTE LO PUEDE VER USUARIOS CON EL ROL DE OPERADOR Y SUPERIORES
    const {
        data: stockLotsByDeliveryLineData,
        isError: stockLotByDeliveryLineError,
        isLoading: stockLotByDeliveryLineIsLoading,
    } = useQuery({
        queryKey: ["deliveryLine", "stockLots", deliveryLineId],
        queryFn: () => getStockLotsByDeliveryLine(deliveryLineId!),
        enabled: !!deliveryLineId && canViewStockLots,
        retry: 0,
    });
    const content = stockLotsByDeliveryLineData || [];

    const buildStartRoutePath = () => {
        if (from === "pending") {
            return `/orders/pending/${deliveryOrderId}`;
        }

        if (from === "my-orders") {
            return `/orders/my-orders/${deliveryOrderId}`;
        }
        return `/orders/${deliveryOrderId}`;
    };

    // Nunca navegues cuando se renderiza el componente
    useEffect(() => {
        if (stockLotByDeliveryLineError) {
            navigate(buildStartRoutePath());
        }
    }, [stockLotByDeliveryLineError]);

    useEffect(() => {
        if (!data && !isLoading) {
            navigate(buildStartRoutePath());
        }
    }, [data, isLoading]);

    if (isLoading || (canViewStockLots && stockLotByDeliveryLineIsLoading)) {
        return <LoadingView />;
    }

    if (isError) {
        return <Error type="500" />;
    }

    if (canViewStockLots && stockLotByDeliveryLineError) {
        return <Error type="500" />;
    }

    if (!data) {
        return <Error type="404" />;
    }

    return (
        <EntityDetailsLayout>
            <EntityDetailsLayout.Header
                title={`Linea de entrega #${deliveryLineId}`}
                actions={
                    <>
                        {hasPermission(ROLE_ADMIN) && (
                            <EditDeliveryLineButton
                                deliveryLineId={deliveryLineId}
                                deliveryOrderId={deliveryOrderId}
                                limitDate={data.limitDate}
                                requiredQuantity={data.requiredQuantity}
                            />
                        )}
                        <ButtonLink
                            size={"large"}
                            text={"Volver a orden"}
                            to={buildStartRoutePath()}
                            color={"gray"}
                            showTextOnMobile
                        />
                    </>
                }
                textDetails={
                    <div className="text-right">
                        <div>Actualizado por: {data.userUpdaterFullname}</div>
                        <div>
                            (
                            {
                                handleFormatDateTimeText(
                                    new Date(data.updatedAt),
                                ).date
                            }{" "}
                            {
                                handleFormatDateTimeText(
                                    new Date(data.updatedAt),
                                ).hour
                            }
                            )
                        </div>
                    </div>
                }
            ></EntityDetailsLayout.Header>

            <EntityDetailsLayout.Content columns={2}>
                <EntityDetailsLayout.Column>
                    <PanelContainer subtitle="Caracteristicas del producto">
                        <PanelContainer.DetailsGrid>
                            <PanelContainer.Detail label="Nombre del producto">
                                {data.productName}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="ID de modelo">
                                {data.modelId}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Nombre del modelo">
                                {data.modelName}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Categoria">
                                {data.categoryName}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Tipo">
                                {data.typeName}
                            </PanelContainer.Detail>
                        </PanelContainer.DetailsGrid>
                        <PanelContainer.Image
                            url={data.modelImageUrl}
                            name={data.modelName}
                            legend={`${data.productName}, ${data.modelName}`}
                        />
                    </PanelContainer>
                </EntityDetailsLayout.Column>
                <EntityDetailsLayout.Column>
                    <EntityDetailsLayout.Grid>
                        <PanelContainer subtitle="Descripción de la linea">
                            <PanelContainer.DetailsGrid>
                                <PanelContainer.Detail label="Fecha limite de entrega">
                                    {handleFormatDateTimeWithoutT(
                                        new Date(data.limitDate),
                                    )}
                                </PanelContainer.Detail>

                                <PanelContainer.Detail label="Cantidad requerida">
                                    {data.requiredQuantity}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Cantidad preparada">
                                    {data.deliveredQuantity}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Cantidad pendiente">
                                    {data.pendingQuantity}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Estado">
                                    <DeliveryLineStatus
                                        deliveryLineStatus={data.lineStatus}
                                    />
                                </PanelContainer.Detail>
                            </PanelContainer.DetailsGrid>
                        </PanelContainer>
                    </EntityDetailsLayout.Grid>

                    {from !== "my-orders" && hasPermission(ROLE_OPERATOR) && (
                        <>
                            <PanelContainer subtitle="Operaciones">
                                <PanelContainer.DetailsGrid>
                                    <PanelContainer.Detail label="Distribuir">
                                        <AllocateDeliveryLineButton
                                            deliveryLineId={deliveryLineId}
                                            deliveryOrderId={deliveryOrderId}
                                            modelId={data.modelId}
                                        />
                                    </PanelContainer.Detail>
                                    <PanelContainer.Detail label="Quitar">
                                        <LostDeliveryLineButton
                                            deliveryLineId={deliveryLineId}
                                            deliveryOrderId={deliveryOrderId}
                                        />
                                    </PanelContainer.Detail>
                                    <PanelContainer.Detail label="Devolver">
                                        <ReturnDeliveryLineButton
                                            deliveryLineId={deliveryLineId}
                                            deliveryOrderId={deliveryOrderId}
                                        />
                                    </PanelContainer.Detail>
                                    {hasPermission(ROLE_ADMIN) && (
                                        <>
                                            <PanelContainer.Detail label="Entregar">
                                                <SendDeliveryLineButton
                                                    deliveryLineId={
                                                        deliveryLineId!
                                                    }
                                                    deliveryOrderId={
                                                        deliveryOrderId!
                                                    }
                                                />
                                            </PanelContainer.Detail>
                                            <PanelContainer.Detail label="Eliminar">
                                                <CancelDeliveryLineButton
                                                    deliveryLineId={
                                                        deliveryLineId!
                                                    }
                                                    deliveryOrderId={
                                                        deliveryOrderId!
                                                    }
                                                />
                                            </PanelContainer.Detail>
                                            <PanelContainer.Detail label="Reportar perdida">
                                                <MissingDeliveryLineButton
                                                    deliveryLineId={
                                                        deliveryLineId!
                                                    }
                                                    deliveryOrderId={
                                                        deliveryOrderId!
                                                    }
                                                />
                                            </PanelContainer.Detail>
                                        </>
                                    )}
                                    {}
                                </PanelContainer.DetailsGrid>
                            </PanelContainer>
                        </>
                    )}
                </EntityDetailsLayout.Column>
            </EntityDetailsLayout.Content>

            {/* DETALLA DE QUE LOTE DE ENTREGA SE HA TOMADO PARA COMPLETAR LA LINEA DE ENTREGA */}

            {hasPermission(ROLE_OPERATOR) && from !== "my-orders" && (
                <EntityDetailsLayout.Content columns={1}>
                    <EntityDetailsLayout.Column>
                        <TableContainer
                            title="Historial de las cantidades tomadas de los lotes de stock"
                            headers={[
                                "ID",
                                "Cantidad",
                                "Fecha",
                                "Código de lote de stock",
                            ]}
                            isError={stockLotByDeliveryLineError}
                            isEmpty={!content.length}
                            isLoading={stockLotByDeliveryLineIsLoading}
                        >
                            {content?.map((stockLot) => {
                                return (
                                    <TableRowContainer key={stockLot.id}>
                                        <BaseTableCell data={stockLot.id} />
                                        <BaseTableCell
                                            data={stockLot.quantityUsed}
                                        />
                                        <BaseTableCell
                                            data={handleFormatDateTimeWithoutT(
                                                new Date(stockLot.createdAt),
                                            )}
                                        />
                                        <BaseTableCell
                                            data={stockLot.stockLotBatch}
                                        />
                                    </TableRowContainer>
                                );
                            })}
                        </TableContainer>
                    </EntityDetailsLayout.Column>
                </EntityDetailsLayout.Content>
            )}
        </EntityDetailsLayout>
    );
};
