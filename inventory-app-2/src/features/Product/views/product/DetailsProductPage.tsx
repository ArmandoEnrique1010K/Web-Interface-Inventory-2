import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../../api/ProductAPI";
import { useLocation, useParams } from "react-router-dom";
import { listAllModelsByProductId } from "../../api/ModelAPI";
import { generateSizes } from "@/utils/generateSizes";
import { Button } from "@/ui/Button";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { PanelContainer } from "@/components/containers/PanelContainer";
import { TableContainer } from "@/components/TableContainer";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { SummaryPanelContainer } from "@/components/SummaryPanelContainer";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { StatusProductButton } from "../../components/product/StatusProductButton";
import { StatusModelButton } from "../../components/model/StatusModelButton";
import { LoadingView } from "@/views/LoadingView";
import { Error } from "@/views/Error";
import { AddModelButton } from "../../components/product/AddModelButton";
import { EditProductButton } from "../../components/product/EditProductButton";
import { EditModelButton } from "../../components/model/EditModelButton";
import { QRButton } from "../../components/QRButton";

export const DetailsProductPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const modelIdParam = searchParams.get("modelId");

    const location = useLocation();
    const path = location.pathname;
    const queryParams = location.search;

    const { id: productIdStr } = useParams();
    const productId = +productIdStr!; // convertir a numero

    const {
        data: productData,
        isLoading: isLoadingProduct,
        isError: isErrorProduct,
    } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => getProduct(+productId!),
        enabled: !!productId,
        retry: 1,
    });

    const {
        data: modelsData = [],
        isLoading: isLoadingModels,
        isError: isErrorModels,
    } = useQuery({
        queryKey: ["models", "product", productId],
        queryFn: () => listAllModelsByProductId(productId!),
        enabled: !!productId,
        retry: 1,
    });

    // ¿Qué pasa si ponen manualmente ? modelId = 999 ?
    //     No pasa nada.
    // findIndex devolverá "-1" y simplemente veran el primer modelo
    const selectedIndex = modelsData?.findIndex(
        (model: { id: number }) => model.id === Number(modelIdParam),
    );

    // Por defecto va a seleccionar el primer modelo del producto
    useEffect(() => {
        if (selectedIndex === -1 && modelsData.length > 0) {
            const lastModel = modelsData[modelsData.length - 1];
            setSearchParams(
                { modelId: String(lastModel.id) },
                { replace: true }, // NO AÑADE UNA NUEVA ENTRADA AL HISTORIA
                // EVITA ROMPER EL BOTON DE ATRAS
            );
        }
    }, [selectedIndex, modelsData, setSearchParams]);

    const idModel = selectedIndex >= 0 ? selectedIndex : 0;

    const selectedModel = modelsData[idModel];

    const hasNext = idModel > 0;
    const hasPrevious = idModel < modelsData.length - 1;
    const displayIndex = modelsData.length - idModel;

    const handleNext = () => {
        if (idModel > 0) {
            const prevModel = modelsData[idModel - 1];
            setSearchParams({ modelId: String(prevModel.id) });
        }
    };

    const handlePrevious = () => {
        if (idModel < modelsData.length - 1) {
            const nextModel = modelsData[idModel + 1];
            setSearchParams({ modelId: String(nextModel.id) });
        }
    };

    if (isLoadingProduct || isLoadingModels) {
        return <LoadingView />;
    }

    if (isErrorModels || isErrorProduct) {
        return <Error type="500" />;
    }

    if (!productData || !modelsData) {
        return <Error type="404" />;
    }

    return (
        <EntityDetailsLayout>
            <EntityDetailsLayout.Header
                title={productData.name}
            ></EntityDetailsLayout.Header>

            <EntityDetailsLayout.Content>
                <EntityDetailsLayout.Column>
                    <PanelContainer subtitle="Características del producto">
                        <PanelContainer.DetailsGrid>
                            <PanelContainer.Detail label="ID">
                                {productData.id}
                            </PanelContainer.Detail>

                            <PanelContainer.Detail label="Categoria">
                                {productData.categoryName}
                            </PanelContainer.Detail>

                            <PanelContainer.Detail label="Tipo">
                                {productData.typeName}
                            </PanelContainer.Detail>

                            <PanelContainer.Detail label="Medidas">
                                {generateSizes(productData)}
                            </PanelContainer.Detail>
                        </PanelContainer.DetailsGrid>

                        {selectedModel && (
                            <PanelContainer.Image
                                url={selectedModel.imageUrl}
                                name={selectedModel.name}
                                legend={`${productData.name}, ${selectedModel.name}`}
                            />
                        )}

                        <PanelContainer.DetailsGrid>
                            {productData.status && (
                                <PanelContainer.Detail label="Editar producto">
                                    <EditProductButton productId={productId} />
                                </PanelContainer.Detail>
                            )}

                            <PanelContainer.Detail label="Estado del producto">
                                <StatusProductButton
                                    size="small"
                                    productId={productId!}
                                    isActive={productData.status}
                                />
                            </PanelContainer.Detail>
                        </PanelContainer.DetailsGrid>
                    </PanelContainer>
                </EntityDetailsLayout.Column>

                <EntityDetailsLayout.Column>
                    <PanelContainer subtitle={"Modelo seleccionado"}>
                        <PanelContainer.Actions>
                            <Button
                                text="◄"
                                type="button"
                                size="small"
                                color="blue"
                                onClick={handlePrevious}
                                disabled={!hasPrevious}
                                showTextOnMobile
                            />

                            <Button
                                text={`${displayIndex} de ${modelsData.length}`}
                                type="button"
                                color="none"
                                size="small"
                                disabled
                                showTextOnMobile
                            />

                            <Button
                                text="►"
                                type="button"
                                color="blue"
                                onClick={handleNext}
                                disabled={!hasNext}
                                size="small"
                                showTextOnMobile
                            />

                            <AddModelButton productId={productId} />
                        </PanelContainer.Actions>

                        <PanelContainer.DetailsGrid>
                            <PanelContainer.Detail label="ID">
                                {selectedModel.id}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Nombre">
                                {selectedModel.name}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Fecha de entrada">
                                {selectedModel.entryDate}
                            </PanelContainer.Detail>

                            {selectedModel.caducityDate && (
                                <PanelContainer.Detail label="Fecha de caducidad">
                                    {selectedModel.caducityDate}
                                </PanelContainer.Detail>
                            )}

                            <PanelContainer.Detail label="Cantidad diponible">
                                {selectedModel.totalQuantityAvailable}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Cantidad recibida">
                                {selectedModel.totalQuantityReceived}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Cantidad entregada">
                                {selectedModel.totalQuantityDelivered}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Codigo QR">
                                <QRButton
                                    modelName={selectedModel.name}
                                    productName={productData.name}
                                    path={path}
                                    queryParams={queryParams}
                                />
                            </PanelContainer.Detail>

                            {selectedModel.status && (
                                <PanelContainer.Detail label="Editar modelo">
                                    <EditModelButton
                                        modelId={selectedModel.id}
                                    />
                                </PanelContainer.Detail>
                            )}

                            <PanelContainer.Detail
                                label="Estado del modelo"
                                isButton
                            >
                                <StatusModelButton
                                    modelId={selectedModel.id}
                                    productId={productId!}
                                    value={
                                        selectedModel.status
                                            ? "Activo"
                                            : "Inactivo"
                                    }
                                    size={"small"}
                                />
                            </PanelContainer.Detail>
                        </PanelContainer.DetailsGrid>
                    </PanelContainer>
                </EntityDetailsLayout.Column>
            </EntityDetailsLayout.Content>

            <EntityDetailsLayout.Summary>
                <SummaryPanelContainer>
                    <TableContainer
                        title="Resumen de modelos"
                        headers={[
                            "ID",
                            "Nombre",
                            "Fecha de entrada",
                            "Total disponible",
                        ]}
                        isError={isErrorModels}
                        isEmpty={!modelsData?.length}
                    >
                        {modelsData?.map((model) => (
                            <TableRowContainer key={model.id}>
                                <BaseTableCell data={model.id} />
                                <BaseTableCell data={model.name} />
                                <BaseTableCell data={model.entryDate} />
                                <BaseTableCell
                                    data={model.totalQuantityAvailable}
                                />
                            </TableRowContainer>
                        ))}
                    </TableContainer>
                </SummaryPanelContainer>
            </EntityDetailsLayout.Summary>
        </EntityDetailsLayout>
    );
};
