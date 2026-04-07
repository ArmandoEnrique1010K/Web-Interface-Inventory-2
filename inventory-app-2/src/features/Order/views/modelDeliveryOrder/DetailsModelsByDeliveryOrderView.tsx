import { PanelContainer } from "@/components/containers/PanelContainer";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { Button } from "@/ui/Button";
import { handleFormatDateTimeText } from "@/utils/handleFormatDateTimeText";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { getDeliveryOrder } from "../../api/DeliveryOrderAPI";
import { listAllModelsByDeliveryOrder } from "../../api/ModelDeliveryOrderAPI";
import { NewModelInDeliveryOrderModal } from "../../components/modelDeliveryOrder/newModelInDeliveryOrder/NewModelInDeliveryOrderModal";
import { Modal } from "@/components/Modal";
import { SendDeliveryOrderButton } from "../../components/deliveryOrder/SendDeliveryOrderButton";
import { ChangeLimitDateButton } from "../../components/deliveryOrder/ChangeLimitDateButton";
import { CancelDeliveryOrderButton } from "../../components/deliveryOrder/CancelDeliveryOrderButton";
import { DeliveryOrderStatus } from "../../components/deliveryOrder/DeliveryOrderStatus";
import { ListDeliveryOrderSumaries } from "../../components/deliveryOrderSummary/ListDeliveryOrderSumaries";
import { LoadingView } from "@/views/LoadingView";
import { Error } from "@/views/Error";

export const DetailsModelsByDeliveryOrderView = () => {
    const { pathname } = useLocation();

    const from = pathname.includes("pending")
        ? "pending"
        : pathname.includes("my-orders")
          ? "my-orders"
          : null;

    const hasInitialized = useRef(false);

    // VENTANA MODAL DE AÑADIR UN MODELO A LA ORDEN DE ENTREGA
    const [addModelDeliveryOrderModalOpen, setAddModelDeliveryOrderModalOpen] =
        useState(false);

    // Parametros de busqueda
    const [searchParams, setSearchParams] = useSearchParams();
    const modelIdParam = searchParams.get("currentModelId");

    // Efecto para guardar cambios en el sessionStorage
    useEffect(() => {
        if (modelIdParam) {
            sessionStorage.setItem("modelIdDeliveryOrder", modelIdParam);
        }
    }, [modelIdParam]);

    // Obtiene la orden de entrega por ID
    const { id: deliveryOrderIdStr } = useParams();
    const deliveryOrderId = +deliveryOrderIdStr!;

    const {
        data: deliveryOrderData,
        isLoading: isDeliveryOrderLoading,
        isError: isDeliveryOrderError,
    } = useQuery({
        queryKey: ["deliveryOrder", deliveryOrderId],
        queryFn: () => getDeliveryOrder(deliveryOrderId!),
        enabled: !!deliveryOrderId,
    });

    // Obtiene la lista de modelos que corresponden a la orden de entrega
    const {
        data: modelsDeliveryOrderData = [],
        isLoading: isModelsDeliveryOrderLoading,
        isError: isModelsDeliveryOrderError,
    } = useQuery({
        queryKey: ["models", "deliveryOrder", deliveryOrderId],
        queryFn: () => listAllModelsByDeliveryOrder(deliveryOrderId!),
        enabled: !!deliveryOrderId,
    });

    // Indice del modelo seleccionado de la orden de entrega
    const selectedIndex =
        modelsDeliveryOrderData?.findIndex(
            (model) => model.id === Number(modelIdParam),
        ) ?? -1;

    // Seleccionar el primer modelo
    useEffect(() => {
        if (hasInitialized.current) return;

        if (!modelsDeliveryOrderData?.length) return;

        const storedModelId = sessionStorage.getItem("modelIdDeliveryOrder");

        if (modelIdParam) {
            hasInitialized.current = true;
            return;
        }

        if (storedModelId) {
            const exists = modelsDeliveryOrderData.some(
                (model) => model.id === Number(storedModelId),
            );

            if (exists) {
                setSearchParams(
                    { currentModelId: storedModelId },
                    { replace: true },
                );
                hasInitialized.current = true;
                return;
            }
        }

        // fallback: último modelo
        const lastModel =
            modelsDeliveryOrderData[modelsDeliveryOrderData.length - 1];
        setSearchParams(
            { currentModelId: String(lastModel.id) },
            { replace: true },
        );

        hasInitialized.current = true;
    }, [modelsDeliveryOrderData, modelIdParam]);

    const idModel = selectedIndex >= 0 ? selectedIndex : 0;
    const selectedModel = modelsDeliveryOrderData?.[idModel];
    const hasNext = idModel > 0;
    const hasPrevious = idModel < (modelsDeliveryOrderData?.length || 0) - 1;
    const displayIndex = (modelsDeliveryOrderData?.length || 0) - idModel;
    const handleNext = () => {
        if (idModel > 0) {
            const prevModel = modelsDeliveryOrderData[idModel - 1];
            setSearchParams(
                { currentModelId: String(prevModel.id) },
                { replace: true },
            );
        }
    };

    const handlePrevious = () => {
        if (idModel < modelsDeliveryOrderData.length - 1) {
            const nextModel = modelsDeliveryOrderData[idModel + 1];
            setSearchParams(
                { currentModelId: String(nextModel.id) },
                { replace: true },
            );
        }
    };

    if (isDeliveryOrderLoading || isModelsDeliveryOrderLoading) {
        return <LoadingView />;
    }

    if (isDeliveryOrderError || isModelsDeliveryOrderError) {
        return <Error type="500" />;
    }

    if (!deliveryOrderData || !modelsDeliveryOrderData) {
        return <Error type="404" />;
    }

    return (
        <>
            <EntityDetailsLayout.Content columns={1}>
                <EntityDetailsLayout.Column>
                    <PanelContainer subtitle="Detalles">
                        <PanelContainer.DetailsGrid>
                            <PanelContainer.Detail label="ID">
                                {deliveryOrderData.id}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Factura">
                                {deliveryOrderData.batch}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Cliente">
                                {deliveryOrderData.userClientFullname}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Fecha limite">
                                {deliveryOrderData.limitDate ? (
                                    <span>
                                        {
                                            handleFormatDateTimeText(
                                                new Date(
                                                    deliveryOrderData.limitDate,
                                                ),
                                            ).date
                                        }{" "}
                                        {
                                            handleFormatDateTimeText(
                                                new Date(
                                                    deliveryOrderData.limitDate,
                                                ),
                                            ).hour
                                        }
                                    </span>
                                ) : (
                                    <span>No disponible</span>
                                )}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Fecha limite prioritaria">
                                {deliveryOrderData.priorityDate ? (
                                    <span>
                                        {
                                            handleFormatDateTimeText(
                                                new Date(
                                                    deliveryOrderData.priorityDate,
                                                ),
                                            ).date
                                        }{" "}
                                        {
                                            handleFormatDateTimeText(
                                                new Date(
                                                    deliveryOrderData.priorityDate,
                                                ),
                                            ).hour
                                        }
                                    </span>
                                ) : (
                                    <span>No hay prioridad</span>
                                )}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Estado">
                                <DeliveryOrderStatus
                                    deliveryOrderStatus={
                                        deliveryOrderData.orderStatus
                                    }
                                />
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Cambiar la fecha limite">
                                <ChangeLimitDateButton
                                    deliveryOrderId={deliveryOrderData.id}
                                />
                            </PanelContainer.Detail>
                        </PanelContainer.DetailsGrid>
                    </PanelContainer>
                </EntityDetailsLayout.Column>
            </EntityDetailsLayout.Content>
            <EntityDetailsLayout.Content columns={2}>
                <EntityDetailsLayout.Column>
                    <PanelContainer subtitle="Imagen del modelo">
                        {selectedModel ? (
                            <>
                                <PanelContainer.Image
                                    url={selectedModel.modelImageUrl}
                                    name={selectedModel.modelName}
                                    legend={`${selectedModel.productName}, ${selectedModel.modelName}`}
                                />
                            </>
                        ) : (
                            <>
                                <div>
                                    Añada al menos un modelo a la orden de
                                    entrega
                                </div>
                            </>
                        )}
                    </PanelContainer>
                </EntityDetailsLayout.Column>
                <EntityDetailsLayout.Column>
                    <PanelContainer subtitle="Modelo seleccionado">
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
                                text={`${displayIndex} de ${modelsDeliveryOrderData?.length}`}
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

                            <Button
                                type="button"
                                size="small"
                                color="green"
                                text="Añadir"
                                showTextOnMobile={true}
                                isLargeOnMobile={false}
                                onClick={() => {
                                    setAddModelDeliveryOrderModalOpen(true);
                                }}
                            />

                            {addModelDeliveryOrderModalOpen &&
                                deliveryOrderId && (
                                    <Modal
                                        isOpen={addModelDeliveryOrderModalOpen}
                                        onClose={() => {
                                            setAddModelDeliveryOrderModalOpen(
                                                false,
                                            );
                                            // LIMPIAR PARAMETROS DE BUSQUEDA DENTRO DE LA VENTANA MODAL
                                            setSearchParams((params) => {
                                                params.delete("keyword");
                                                params.delete("page");
                                                return params;
                                            });
                                        }}
                                        size="xl"
                                        title={`Añadir nuevo modelo a la orden de entrega #${deliveryOrderId}`}
                                        locked
                                    >
                                        <NewModelInDeliveryOrderModal
                                            setAddModelDeliveryOrderModalOpen={
                                                setAddModelDeliveryOrderModalOpen
                                            }
                                            deliveryOrderId={deliveryOrderId}
                                            searchParams={searchParams}
                                            setSearchParams={setSearchParams}
                                            existingModels={
                                                modelsDeliveryOrderData
                                            }
                                            currentModelId={selectedModel?.id}
                                        />
                                    </Modal>
                                )}
                        </PanelContainer.Actions>
                        <PanelContainer.DetailsGrid>
                            {selectedModel ? (
                                <>
                                    <PanelContainer.Detail label="ID de relación">
                                        {selectedModel.id}
                                    </PanelContainer.Detail>
                                    <PanelContainer.Detail label="Producto">
                                        {selectedModel.productName}
                                    </PanelContainer.Detail>
                                    <PanelContainer.Detail label="Modelo">
                                        {selectedModel.modelName}
                                    </PanelContainer.Detail>
                                    <PanelContainer.Detail label="ID de modelo">
                                        {selectedModel.modelId}
                                    </PanelContainer.Detail>
                                    <PanelContainer.Detail label="Cantidad requerida">
                                        {selectedModel.requiredQuantityTotal}
                                    </PanelContainer.Detail>
                                </>
                            ) : (
                                <div>No hay modelos</div>
                            )}
                        </PanelContainer.DetailsGrid>
                    </PanelContainer>

                    {from === "my-orders" || (
                        <PanelContainer subtitle="Operaciones">
                            <PanelContainer.DetailsGrid>
                                <PanelContainer.Detail label="Entregar">
                                    <SendDeliveryOrderButton
                                        deliveryOrderId={deliveryOrderId}
                                    />
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Cancelar">
                                    <CancelDeliveryOrderButton
                                        deliveryOrderId={deliveryOrderId}
                                    />
                                </PanelContainer.Detail>
                            </PanelContainer.DetailsGrid>
                        </PanelContainer>
                    )}
                </EntityDetailsLayout.Column>
            </EntityDetailsLayout.Content>
            <EntityDetailsLayout.Content columns={1}>
                <ListDeliveryOrderSumaries deliveryOrderId={deliveryOrderId} />
            </EntityDetailsLayout.Content>
        </>
    );
};
