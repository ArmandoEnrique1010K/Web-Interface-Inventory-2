import { useParams } from "react-router-dom";
import { getModel } from "../../api/ModelAPI";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { QRModal } from "../../components/QRModal";
import { StatusProductButton } from "../../components/product/StatusProductButton";
import { StatusModelButton } from "../../components/model/StatusModelButton";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { PanelContainer } from "@/components/containers/PanelContainer";
import { LoadingView } from "@/views/LoadingView";
import { Error } from "@/views/Error";
import { EditModelButton } from "../../components/model/EditModelButton";
import { EditProductButton } from "../../components/product/EditProductButton";

export const DetailsModelPage = () => {
    const { modelId: modelIdStr, productId: productIdStr } = useParams();

    const modelId = +modelIdStr!; // convertir a numero
    const productId = +productIdStr!; // convertir a numero

    const { data, isError, isLoading } = useQuery({
        queryKey: ["model", modelId],
        queryFn: () => getModel(modelId!),
        // Si el id existe, ejecuta la función getProduct, de lo contrario no lo va a ejecutar
        enabled: !!modelId,
        retry: 1,
    });
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const handleOpenQR = () => {
        setIsQRModalOpen(true);
    };

    if (isLoading) {
        return <LoadingView />;
    }

    if (isError || !data) {
        return <Error />;
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
                            <PanelContainer.Detail label="Editar modelo">
                                <EditModelButton modelId={modelId} />
                            </PanelContainer.Detail>
                            {/* <StatusModelButton 
                            from='model-details' 
                            modelId={modelId!} size="large" productId={productId!} value={data!.status ? 'Desactivar modelo' : 'Activar modelo'} /> */}

                            <PanelContainer.Detail label="Estado del modelo">
                                <StatusModelButton
                                    from="product-details"
                                    modelId={modelId!}
                                    size="small"
                                    productId={productId!}
                                    value={data.status ? "Activo" : "Inactivo"}
                                />
                            </PanelContainer.Detail>
                        </PanelContainer.DetailsGrid>
                    </PanelContainer>
                </EntityDetailsLayout.Column>
                <EntityDetailsLayout.Column>
                    <PanelContainer subtitle={"Pertenece al producto"}>
                        <PanelContainer.DetailsGrid>
                            <PanelContainer.Detail label="ID">
                                {data.id}
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
                                <Button
                                    text="Obtener QR"
                                    type="button"
                                    color="blue"
                                    size="small"
                                    onClick={handleOpenQR}
                                />

                                <QRModal
                                    isOpen={isQRModalOpen}
                                    onClose={() => setIsQRModalOpen(false)}
                                    url={
                                        import.meta.env.VITE_FRONTEND_DOMAIN +
                                        `/product/${data.productId}/model/${data.id}`
                                    }
                                    title={`Código QR del producto ${data.productName}, ${data.name}`}
                                />
                            </PanelContainer.Detail>

                            <PanelContainer.Detail
                                label="Estado del producto"
                                isButton
                            >
                                <StatusProductButton
                                    isActive={data.productStatus}
                                    productId={productId!}
                                    size={"small"}
                                />
                            </PanelContainer.Detail>
                            {data.status && (
                                <PanelContainer.Detail label="Editar producto">
                                    <EditProductButton productId={productId} />
                                </PanelContainer.Detail>
                            )}
                        </PanelContainer.DetailsGrid>
                    </PanelContainer>
                </EntityDetailsLayout.Column>
            </EntityDetailsLayout.Content>
        </EntityDetailsLayout>
    );
};
