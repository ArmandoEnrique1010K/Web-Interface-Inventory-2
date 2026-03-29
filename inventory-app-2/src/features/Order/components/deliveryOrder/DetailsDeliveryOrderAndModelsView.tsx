import { PanelContainer } from "@/components/containers/PanelContainer"
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout"
import { Button } from "@/ui/Button"
import { handleFormatDateTimeText } from "@/utils/handleFormatDateTimeText"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { getDeliveryOrder } from "../../api/DeliveryOrderAPI"
import type { DeliveryOrderDetailsItem, ModelDeliveryOrderItem } from "../../types"
import { listAllModelsByDeliveryOrder } from "../../api/ModelDeliveryOrderAPI"
import { NewModelDeliveryOrderModal } from "./NewModelDeliveryOrderModal"
import { Modal } from "@/components/Modal"

export const DetailsDeliveryOrderAndModelsView = () => {
    const hasInitialized = useRef(false);


    // VENTANA MODAL DE AÑADIR UN MODELO A LA ORDEN DE ENTREGA
    const [addModelDeliveryOrderModalOpen, setAddModelDeliveryOrderModalOpen] = useState(false);

    // Parametros de busqueda
    const [searchParams, setSearchParams] = useSearchParams()
    const modelIdParam = searchParams.get("currentModelId")

    // Efecto para guardar cambios en el sessionStorage
    useEffect(() => {
        if (modelIdParam) {
            sessionStorage.setItem('modelIdDeliveryOrder', modelIdParam);
        }
    }, [modelIdParam]);


    // Obtiene la orden de entrega por ID
    const { id: deliveryOrderId } = useParams();

    const { data: deliveryOrderData, /* isLoading: isDeliveryOrderDataLoading */ } = useQuery<DeliveryOrderDetailsItem>({
        queryKey: ['deliveryOrder', deliveryOrderId],
        queryFn: () => getDeliveryOrder(deliveryOrderId!),
        enabled: !!deliveryOrderId
    })

    // Obtiene la lista de modelos que corresponden a la orden de entrega
    const { data: modelsDeliveryOrderData, /* isLoading: isModelsDeliveryOrderDataLoading */ } = useQuery({
        queryKey: ['models', 'deliveryOrder', deliveryOrderId],
        queryFn: () => listAllModelsByDeliveryOrder(deliveryOrderId!),
        enabled: !!deliveryOrderId,
    })

    // Indice del modelo seleccionado de la orden de entrega
    const selectedIndex = modelsDeliveryOrderData?.findIndex(
        (model: ModelDeliveryOrderItem) => model.id === Number(modelIdParam)) ?? -1;



    // Seleccionar el primer modelo
    useEffect(() => {
        if (hasInitialized.current) return;

        if (!modelsDeliveryOrderData?.length) return;

        const storedModelId = sessionStorage.getItem('modelIdDeliveryOrder');

        if (modelIdParam) {
            hasInitialized.current = true;
            return;
        }

        if (storedModelId) {
            const exists = modelsDeliveryOrderData.some(
                (model: ModelDeliveryOrderItem) => model.id === Number(storedModelId)
            );

            if (exists) {
                setSearchParams({ currentModelId: storedModelId });
                hasInitialized.current = true;
                return;
            }
        }

        // fallback: último modelo
        const lastModel = modelsDeliveryOrderData[modelsDeliveryOrderData.length - 1];
        setSearchParams({ currentModelId: String(lastModel.id) });

        hasInitialized.current = true;

    }, [modelsDeliveryOrderData, modelIdParam]);


    const idModel = selectedIndex >= 0 ? selectedIndex : 0
    const selectedModel = modelsDeliveryOrderData?.[idModel]
    const hasNext = idModel > 0
    const hasPrevious = idModel < (modelsDeliveryOrderData?.length || 0) - 1
    const displayIndex = (modelsDeliveryOrderData?.length || 0) - idModel
    const handleNext = () => {

        if (idModel > 0) {
            const prevModel = modelsDeliveryOrderData[idModel - 1]
            setSearchParams({ currentModelId: String(prevModel.id) })
        }

    }

    const handlePrevious = () => {
        if (idModel < modelsDeliveryOrderData.length - 1) {
            const nextModel = modelsDeliveryOrderData[idModel + 1]
            setSearchParams({ currentModelId: String(nextModel.id) })
        }

    }

    // if (isDeliveryOrderDataLoading || isModelsDeliveryOrderDataLoading) {
    //     return <div>Cargando...</div>
    // }

    if (!deliveryOrderData) {
        return <div>Orden de entrega no encontrada o desactivada</div>
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
                                    <span>{handleFormatDateTimeText(new Date(deliveryOrderData.limitDate)).date} {handleFormatDateTimeText(new Date(deliveryOrderData.limitDate)).hour}</span>
                                ) : (
                                    <span>No disponible</span>
                                )}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Fecha limite prioritaria">
                                {deliveryOrderData.priorityDate ? deliveryOrderData.priorityDate : "No hay prioridad"}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Estado">
                                {deliveryOrderData.orderStatus}
                            </PanelContainer.Detail>
                        </PanelContainer.DetailsGrid>
                    </PanelContainer>

                </EntityDetailsLayout.Column>
            </EntityDetailsLayout.Content>
            <EntityDetailsLayout.Content columns={2}>
                <EntityDetailsLayout.Column>
                    <PanelContainer subtitle="Imagen del modelo">
                        {
                            selectedModel ? (<>
                                <PanelContainer.Image
                                    url={selectedModel.modelImageUrl}
                                    name={selectedModel.name}
                                    legend={`${selectedModel.productName}, ${selectedModel.modelName}`}
                                />

                            </>) : (
                                <>
                                    <div>Añada al menos un modelo a la orden de entrega</div>
                                </>
                            )
                        }
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
                                    setAddModelDeliveryOrderModalOpen(true)
                                }}
                            />

                            {
                                addModelDeliveryOrderModalOpen && deliveryOrderId && <Modal
                                    isOpen={addModelDeliveryOrderModalOpen}
                                    onClose={() => {
                                        setAddModelDeliveryOrderModalOpen(false)
                                        // LIMPIAR PARAMETROS DE BUSQUEDA DENTRO DE LA VENTANA MODAL
                                        setSearchParams((params) => {
                                            params.delete('keyword')
                                            params.delete('page')
                                            return params
                                        })
                                    }
                                    }
                                    size='xl'
                                    title={`Añadir nuevo modelo a la orden de entrega #${deliveryOrderId}`}
                                    locked
                                >
                                    <NewModelDeliveryOrderModal
                                        setAddModelDeliveryOrderModalOpen={setAddModelDeliveryOrderModalOpen}
                                        deliveryOrderId={deliveryOrderId}
                                        searchParams={searchParams}
                                        setSearchParams={setSearchParams}
                                        existingModels={modelsDeliveryOrderData}
                                        currentModelId={selectedModel?.id}
                                    />
                                </Modal>



                            }

                        </PanelContainer.Actions>
                        <PanelContainer.DetailsGrid>
                            {
                                selectedModel ? (
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
                                            {selectedModel.currentModelId}
                                        </PanelContainer.Detail>
                                        <PanelContainer.Detail label="Cantidad requerida">
                                            {selectedModel.requiredQuantityTotal}
                                        </PanelContainer.Detail>

                                    </>
                                ) : (
                                    <div>No hay modelos</div>
                                )
                            }


                        </PanelContainer.DetailsGrid>




                    </PanelContainer>
                </EntityDetailsLayout.Column>

            </EntityDetailsLayout.Content>


        </>
    )
}
