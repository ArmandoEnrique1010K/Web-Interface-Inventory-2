import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { getDeliveryOrder } from "../../api/DeliveryOrderAPI";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { type DeliveryOrderDetailsItem, type ModelDeliveryOrderItem } from "../../types";
import { PanelContainer } from "@/components/containers/PanelContainer";
import { handleFormatDateTimeText } from "@/utils/handleFormatDateTimeText";
import { listAllModelsByDeliveryOrder } from "../../api/ModelDeliveryOrderAPI";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { NewModelDeliveryOrderModal } from "../../components/deliveryOrder/NewModelDeliveryOrderModal";

export const DetailsDeliveryOrderPage = () => {

    // ESTABLECE SI VA A MOSTRAR LA DESCRIPCION O LAS ORDENES DE ENTREGA
    const [showDescription, setShowDescription] = useState(true);

    // VENTANA MODAL DE AÑADIR UN MODELO A LA ORDEN DE ENTREGA
    const [addModelDeliveryOrderModalOpen, setAddModelDeliveryOrderModalOpen] = useState(false);

    // const location = useLocation();
    // const path = location.pathname;
    const [searchParams, setSearchParams] = useSearchParams()
    const modelIdParam = searchParams.get("modelId")

    // Obtiene la orden de entrega por ID
    const { id: deliveryOrderId } = useParams();

    const { data: deliveryOrderData, isLoading: isDeliveryOrderDataLoading } = useQuery<DeliveryOrderDetailsItem>({
        queryKey: ['deliveryOrder', deliveryOrderId],
        queryFn: () => getDeliveryOrder(deliveryOrderId!),
        enabled: !!deliveryOrderId
    })

    // Obtiene la lista de modelos que corresponden a la orden de entrega
    const { data: modelsDeliveryOrderData, isLoading: isModelsDeliveryOrderDataLoading } = useQuery({
        queryKey: ['models', 'deliveryOrder', deliveryOrderId],
        queryFn: () => listAllModelsByDeliveryOrder(deliveryOrderId!),
        enabled: !!deliveryOrderId,
    })

    const selectedIndex = modelsDeliveryOrderData?.findIndex(
        (model: ModelDeliveryOrderItem) => model.id === Number(modelIdParam)) ?? -1;

    const idModel = selectedIndex >= 0 ? selectedIndex : 0
    const selectedModel = modelsDeliveryOrderData?.[idModel]
    const hasNext = idModel > 0
    const hasPrevious = idModel < (modelsDeliveryOrderData?.length || 0) - 1
    const displayIndex = (modelsDeliveryOrderData?.length || 0) - idModel
    const handleNext = () => {

        if (idModel > 0) {
            const prevModel = modelsDeliveryOrderData[idModel - 1]
            setSearchParams({ modelId: String(prevModel.id) })
        }

    }

    const handlePrevious = () => {
        if (idModel < modelsDeliveryOrderData.length - 1) {
            const nextModel = modelsDeliveryOrderData[idModel + 1]
            setSearchParams({ modelId: String(nextModel.id) })


        }

    }

    if (isDeliveryOrderDataLoading || isModelsDeliveryOrderDataLoading) {
        return <div>Cargando...</div>
    }

    if (!deliveryOrderData) {
        return <div>Orden de entrega no encontrada o desactivada</div>
    }

    return (
        <EntityDetailsLayout>
            <EntityDetailsLayout.Header
                title={`Orden de entrega #${deliveryOrderId}`}
                actions={
                    <>
                        {/* <ButtonLink size={"large"} text={"Agregar modelo"} to={"/"} color={"blue"} showTextOnMobile /> */}
                        <Button
                            type={"button"}
                            size="large"
                            text="Descripción"
                            showTextOnMobile
                            color={`${showDescription ? 'blue' : 'blue-outline'}`}
                            onClick={() => setShowDescription(true)}
                        />
                        <Button
                            type={"button"}
                            size="large"
                            text="Lineas de entrega"
                            showTextOnMobile
                            color={`${!showDescription ? 'blue' : 'blue-outline'}`}
                            onClick={() => setShowDescription(false)}
                        />

                    </>
                }
                textDetails={
                    <div className="text-right">
                        <div>
                            Creado por: {deliveryOrderData.createdByUser}
                        </div>
                        <div className="">
                            ({handleFormatDateTimeText(new Date(deliveryOrderData.createdAt)).date}{" "}
                            {handleFormatDateTimeText(new Date(deliveryOrderData.createdAt)).hour})
                        </div>
                        <div>
                            Actualizado por: {deliveryOrderData.updatedByUser}
                        </div>
                        <div className="">
                            ({handleFormatDateTimeText(new Date(deliveryOrderData.updatedAt)).date}{" "}
                            {handleFormatDateTimeText(new Date(deliveryOrderData.updatedAt)).hour})
                        </div>

                    </div>
                }

            ></EntityDetailsLayout.Header>
            {
                showDescription ? (<>
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
                                    selectedModel ? (<div>Cargar imagen</div>) : (
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
                                        text={`${displayIndex} de ${modelsDeliveryOrderData.length}`}
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


                                            }
                                            }
                                            size='lg'
                                            title={`Añadir nuevo modelo a la orden de entrega #${deliveryOrderId}`}
                                            locked
                                        >
                                            <NewModelDeliveryOrderModal setAddModelDeliveryOrderModalOpen={setAddModelDeliveryOrderModalOpen} deliveryOrderId={deliveryOrderId} />
                                        </Modal>



                                    }

                                </PanelContainer.Actions>

                            </PanelContainer>
                        </EntityDetailsLayout.Column>

                    </EntityDetailsLayout.Content>


                </>) : <div>Lineas de entrega</div>
            }


        </EntityDetailsLayout>
    )
}
