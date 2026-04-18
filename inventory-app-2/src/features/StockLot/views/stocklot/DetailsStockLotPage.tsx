import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getStockLot } from "../../api/StockLotAPI";
import { handleFormatDateTime } from "@/utils/handleFormatDateTime";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { PanelContainer } from "@/components/containers/PanelContainer";
import { LoadingView } from "@/views/LoadingView";
import { Error } from "@/views/Error";
import { IncreaseStockLotButton } from "../../components/stocklot/IncreaseStockLotButton";
import { DecreaseStockLotButton } from "../../components/stocklot/DecreaseStockLotButton";
import { RecoveryStockLotButton } from "../../components/stocklot/RecoveryStockLotButton";
import { TransferStockLotButton } from "../../components/stocklot/TransferStockLotButton";

export const DetailsStockLotPage = () => {
    const { id: stockLotIdstr } = useParams();
    const stockLotId = +stockLotIdstr!;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["stocklot", stockLotId],
        queryFn: () => getStockLot(stockLotId!),
        enabled: !!stockLotId,
    });

    if (isLoading) {
        return <LoadingView />;
    }

    if (isError) {
        return <Error type="500" />;
    }

    if (!data) {
        return <Error type="404" />;
    }

    return (
        <EntityDetailsLayout>
            <EntityDetailsLayout.Header
                title={data.batch}
            ></EntityDetailsLayout.Header>

            <EntityDetailsLayout.Content>
                <EntityDetailsLayout.Column>
                    <PanelContainer subtitle="Características del lote de stock">
                        <PanelContainer.DetailsGrid>
                            <PanelContainer.Detail label="ID">
                                {data.id}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Código de lote">
                                {data.batch}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Fecha de creación">
                                {handleFormatDateTime(new Date(data.createdAt))}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Actualizado por última vez">
                                {handleFormatDateTime(new Date(data.updatedAt))}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Creado por">
                                {data.temporary === true
                                    ? "el sistema"
                                    : "un usuario"}
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
                        <PanelContainer subtitle={"Modelo seleccionado"}>
                            <PanelContainer.DetailsGrid>
                                <PanelContainer.Detail label="ID de producto">
                                    {data.productId}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Nombre de producto">
                                    {data.productName}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="ID de modelo">
                                    {data.modelId}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Nombre de producto">
                                    {data.modelName}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Categoria">
                                    {data.categoryName}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Tipo">
                                    {data.typeName}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Importado por">
                                    {data.companyName}
                                </PanelContainer.Detail>
                            </PanelContainer.DetailsGrid>
                        </PanelContainer>
                    </EntityDetailsLayout.Grid>
                    <EntityDetailsLayout.Grid>
                        <PanelContainer subtitle="Cantidades">
                            <PanelContainer.DetailsGrid>
                                <PanelContainer.Detail label="Cantidad recibida">
                                    {data.quantityReceived}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Cantidad disponible">
                                    {data.quantityAvailable}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Cantidad entregada">
                                    {data.quantityDelivered}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Cantidad perdida">
                                    {data.quantityLost}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Cantidad recuperada">
                                    {data.quantityRecovered}
                                </PanelContainer.Detail>
                            </PanelContainer.DetailsGrid>
                        </PanelContainer>
                    </EntityDetailsLayout.Grid>
                    <EntityDetailsLayout.Grid>
                        {/* TODO: PENDIENTE EL MANEJO DEL CAMPO ZEROSTOCKLOT */}
                        <PanelContainer subtitle={"Operaciones"}>
                            <PanelContainer.DetailsGrid>
                                <PanelContainer.Detail label="Agregar">
                                    <IncreaseStockLotButton
                                        stockLotId={data.id}
                                    />
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Quitar">
                                    <DecreaseStockLotButton
                                        stockLotId={data.id}
                                    />
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Recuperar">
                                    <RecoveryStockLotButton
                                        stockLotId={data.id}
                                    />
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Transferir">
                                    <TransferStockLotButton
                                        stockLotId={data.id}
                                    />
                                </PanelContainer.Detail>
                            </PanelContainer.DetailsGrid>
                        </PanelContainer>
                    </EntityDetailsLayout.Grid>
                </EntityDetailsLayout.Column>
            </EntityDetailsLayout.Content>
        </EntityDetailsLayout>
    );
};
