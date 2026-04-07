import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getMovement } from "../api/MovementAPI";
import { LoadingView } from "@/views/LoadingView";
import { Error } from "@/views/Error";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { PanelContainer } from "@/components/containers/PanelContainer";
import { handleFormatDateTimeWithoutT } from "@/utils/handleFormatDateTime";
import { MovementType } from "../components/MovementType";
import { LinkText } from "@/components/LinkText";
import { listAllMovement_StockLotsByMovement } from "../api/MovementStockLotAPI";
import { TableContainer } from "@/components/TableContainer";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";

export const DetailMovementPage = () => {
    const { id: movementIdStr } = useParams();
    const movementId = +movementIdStr!;

    const {
        data: movementData,
        isLoading: isLoadingMovement,
        isError: isErrorMovement,
    } = useQuery({
        queryKey: ["movement", movementId],
        queryFn: () => getMovement(movementId!),
        enabled: !!movementId,
        retry: false,
    });

    const {
        data: movementStockLotsData,
        isLoading: movementStockLotsIsLoading,
        isError: movementStockLotsIsError,
    } = useQuery({
        queryKey: ["movement", "stockLots", movementId],
        queryFn: () => listAllMovement_StockLotsByMovement(movementId),
        enabled: !!movementId,
        retry: false,
    });

    if (isLoadingMovement || movementStockLotsIsLoading) {
        return <LoadingView />;
    }

    if (isErrorMovement || movementStockLotsIsError) {
        console.log(movementData);
        return <Error type="500" />;
    }

    if (!movementData || !movementStockLotsData) {
        return <Error type="404" />;
    }

    return (
        <EntityDetailsLayout>
            <EntityDetailsLayout.Header
                title={`Movimiento #${movementId}`}
                textDetails={
                    <div className="text-right">
                        <div>Realizado por: {movementData.userName}</div>
                        <div>
                            {" "}
                            {handleFormatDateTimeWithoutT(
                                new Date(movementData.createdAt),
                            )}
                        </div>
                    </div>
                }
            />
            <EntityDetailsLayout.Content columns={1}>
                <EntityDetailsLayout.Column>
                    <PanelContainer subtitle="Tipo">
                        <PanelContainer.DetailsGrid>
                            <PanelContainer.Detail label="ID">
                                {movementData.id}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Tipo de movimiento">
                                <MovementType
                                    movementType={movementData.movementType}
                                    type="text"
                                />
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Comentario">
                                {movementData.comment
                                    ? movementData.comment
                                    : "Sin comentario"}
                            </PanelContainer.Detail>
                        </PanelContainer.DetailsGrid>
                    </PanelContainer>
                </EntityDetailsLayout.Column>
            </EntityDetailsLayout.Content>
            <EntityDetailsLayout.Content columns={2}>
                <EntityDetailsLayout.Column>
                    <PanelContainer subtitle="Modelo del producto">
                        <PanelContainer.Detail label="Nombre del producto">
                            {movementData.productName}
                        </PanelContainer.Detail>
                        <PanelContainer.Detail label="Nombre del modelo">
                            {movementData.modelName}
                        </PanelContainer.Detail>

                        <PanelContainer.Image
                            url={movementData.imageUrl}
                            name={movementData.modelName}
                            legend={`${movementData.productName}, ${movementData.modelName}`}
                        />
                    </PanelContainer>
                </EntityDetailsLayout.Column>
                <EntityDetailsLayout.Column>
                    {movementData.stockLotReceiverId && (
                        <PanelContainer subtitle="Lote de Stock">
                            {movementData.stockLotReceiverId && (
                                <PanelContainer.Detail label="Código de lote de stock receptor">
                                    {movementData.stockLotReceiverBatch}
                                </PanelContainer.Detail>
                            )}
                            {movementData.stockLotEmitterId && (
                                <PanelContainer.Detail label="Código de lote de stock emisor">
                                    {movementData.stockLotEmitterBatch}
                                </PanelContainer.Detail>
                            )}
                        </PanelContainer>
                    )}

                    {movementData.deliveryLineId && (
                        <PanelContainer subtitle="Linea de Entrega">
                            <PanelContainer.Detail label="ID de linea de entrega">
                                {movementData.deliveryLineId}
                            </PanelContainer.Detail>

                            <PanelContainer.Detail label="Factura de orden de entrega">
                                {movementData.deliveryOrderBatch}
                            </PanelContainer.Detail>
                        </PanelContainer>
                    )}
                </EntityDetailsLayout.Column>
            </EntityDetailsLayout.Content>
            {movementData.movements_StockLots.length > 0 && (
                <TableContainer
                    title="Se ha tomado de..."
                    headers={["ID", "Código", "Cantidad"]}
                    isError={movementStockLotsIsError}
                    isEmpty={!movementStockLotsData?.length}
                    isLoading={movementStockLotsIsLoading}
                >
                    {movementStockLotsData?.map((movementStockLot) => {
                        return (
                            <TableRowContainer key={movementStockLot.id}>
                                <BaseTableCell data={movementStockLot.id} />
                                <BaseTableCell
                                    data={
                                        <LinkText
                                            to={`/stocklots/${movementStockLot.stockLotId}`}
                                        >
                                            {movementStockLot.stockLotBatch}
                                        </LinkText>
                                    }
                                />
                                <BaseTableCell
                                    isCenter
                                    data={movementStockLot.quantityTaken}
                                />
                            </TableRowContainer>
                        );
                    })}
                </TableContainer>
            )}
        </EntityDetailsLayout>
    );
};
