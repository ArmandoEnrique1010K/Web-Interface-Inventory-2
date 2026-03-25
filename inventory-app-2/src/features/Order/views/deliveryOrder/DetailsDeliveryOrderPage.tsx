import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getDeliveryOrder } from "../../api/DeliveryOrderAPI";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { type DeliveryOrderDetailsItem } from "../../types";
import { PanelContainer } from "@/components/containers/PanelContainer";
import { handleFormatDateTimeText } from "@/utils/handleFormatDateTimeText";
import { ButtonLink } from "@/ui/ButtonLink";

export const DetailsDeliveryOrderPage = () => {

    // const location = useLocation();
    // const path = location.pathname;

    const { id: deliveryOrderId } = useParams();

    const { data: deliveryOrderData, isLoading: isDeliveryOrderDataLoading } = useQuery<DeliveryOrderDetailsItem>({
        queryKey: ['deliveryOrder', deliveryOrderId],
        queryFn: () => getDeliveryOrder(deliveryOrderId!),
        enabled: !!deliveryOrderId
    })

    if (isDeliveryOrderDataLoading) {
        return <div>Cargando...</div>
    }

    if (!deliveryOrderData) {
        return <div>Producto no encontrado o desactivado</div>
    }

    return (
        <EntityDetailsLayout>
            <EntityDetailsLayout.Header
                title={`Orden de entrega #${deliveryOrderId}`}
                actions={
                    <>
                        <ButtonLink size={"large"} text={"Agregar modelo"} to={"/"} color={"blue"} showTextOnMobile />
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

                    <PanelContainer>
                        a
                    </PanelContainer>
                </EntityDetailsLayout.Column>
            </EntityDetailsLayout.Content>
        </EntityDetailsLayout>
    )
}
