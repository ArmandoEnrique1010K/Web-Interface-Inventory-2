import { useLocation, useParams } from "react-router-dom";
import { getModel } from "../../api/ModelAPI";
import { useQuery } from "@tanstack/react-query";
import { StatusProductButton } from "../../components/product/StatusProductButton";
import { StatusModelButton } from "../../components/model/StatusModelButton";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { PanelContainer } from "@/components/containers/PanelContainer";
import { LoadingView } from "@/views/LoadingView";
import { Error } from "@/views/Error";
import { EditModelButton } from "../../components/model/EditModelButton";
import { EditProductButton } from "../../components/product/EditProductButton";
import { QRButton } from "../../components/QRButton";

export const DetailsModelPage = () => {
    const { modelId: modelIdStr } = useParams();

    const modelId = +modelIdStr!; // convertir a numero

    const { data, isError, isLoading } = useQuery({
        queryKey: ["model", modelId],
        queryFn: () => getModel(modelId!),
        // Si el id existe, ejecuta la función getProduct, de lo contrario no lo va a ejecutar
        enabled: !!modelId,
        retry: 1,
    });

    const location = useLocation();
    const path = location.pathname;

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
                title={data.productName + ", " + data.name}
            ></EntityDetailsLayout.Header>
            <EntityDetailsLayout.Content>
                <EntityDetailsLayout.Column>
                    <PanelContainer subtitle="Características del modelo">
                        <PanelContainer.DetailsGrid>
                            <PanelContainer.Detail label="ID">
                                {data.id}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Nombre">
                                {data.name}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Fecha de entrada">
                                {data.entryDate}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Fecha de caducidad">
                                {data.caducityDate}
                            </PanelContainer.Detail>
                        </PanelContainer.DetailsGrid>
                        <PanelContainer.Image
                            url={data.imageUrl}
                            name={data.name}
                            legend={`${data.productName}, ${data.name}`}
                        />

                        <PanelContainer.DetailsGrid>
                            <PanelContainer.Detail label="Estado del modelo">
                                <StatusModelButton
                                    from="product-details"
                                    modelId={modelId!}
                                    size="small"
                                    productId={data.productId}
                                    value={data.status ? "Activo" : "Inactivo"}
                                />
                            </PanelContainer.Detail>
                            {data.status && (
                                <PanelContainer.Detail label="Editar modelo">
                                    <EditModelButton modelId={modelId} />
                                </PanelContainer.Detail>
                            )}
                        </PanelContainer.DetailsGrid>
                    </PanelContainer>
                </EntityDetailsLayout.Column>
                <EntityDetailsLayout.Column>
                    <PanelContainer subtitle={"Pertenece al producto"}>
                        <PanelContainer.DetailsGrid>
                            <PanelContainer.Detail label="ID">
                                {data.productId}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Nombre">
                                {data.productName}
                            </PanelContainer.Detail>
                            {Number(data.productLength) !== 0 && (
                                <PanelContainer.Detail label="Largo">
                                    {data.productLength} cm.
                                </PanelContainer.Detail>
                            )}
                            {Number(data.productWidth) !== 0 && (
                                <PanelContainer.Detail label="Ancho">
                                    {data.productWidth} cm.
                                </PanelContainer.Detail>
                            )}
                            {Number(data.productHeight) !== 0 && (
                                <PanelContainer.Detail label="Altura">
                                    {data.productHeight} cm.
                                </PanelContainer.Detail>
                            )}
                            <PanelContainer.Detail label="Categoria">
                                {data.categoryName}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Tipo">
                                {data.typeName}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Codigo QR">
                                <QRButton
                                    modelName={data.name}
                                    productName={data.productName}
                                    path={path}
                                />
                            </PanelContainer.Detail>

                            <PanelContainer.Detail
                                label="Estado del producto"
                                isButton
                            >
                                <StatusProductButton
                                    isActive={data.productStatus}
                                    productId={data.productId}
                                    size={"small"}
                                />
                            </PanelContainer.Detail>
                            {data.productStatus && (
                                <PanelContainer.Detail label="Editar producto">
                                    <EditProductButton
                                        productId={data.productId}
                                    />
                                </PanelContainer.Detail>
                            )}
                        </PanelContainer.DetailsGrid>
                    </PanelContainer>
                </EntityDetailsLayout.Column>
            </EntityDetailsLayout.Content>
        </EntityDetailsLayout>
    );
};
