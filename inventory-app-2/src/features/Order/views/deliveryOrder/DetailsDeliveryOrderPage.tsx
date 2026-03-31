import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getDeliveryOrder } from "../../api/DeliveryOrderAPI";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { type DeliveryOrderDetailsItem } from "../../types";
import { handleFormatDateTimeText } from "@/utils/handleFormatDateTimeText";
import { useState } from "react";
import { DetailsDeliveryOrderAndModelsView } from "../../components/deliveryOrder/DetailsDeliveryOrderAndModelsView";
import { ListDeliveryLineByDeliveryOrder } from "../../components/deliveryOrder/ListDeliveryLineByDeliveryOrder";

export const DetailsDeliveryOrderPage = () => {

    // ESTABLECE SI VA A MOSTRAR LA DESCRIPCION O LAS ORDENES DE ENTREGA
    const [showDescription, setShowDescription] = useState(false);

    // Obtiene la orden de entrega por ID
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
        return <div>Orden de entrega no encontrada o desactivada</div>
    }

    return (
        <EntityDetailsLayout>
            <EntityDetailsLayout.Header
                title={`Orden de entrega #${deliveryOrderId}`}
                actions={
                    <div className="w-full border-b border-gray-200   mt-6">

                        <button
                            className={`w-1/2 px-4 py-2 text-center transition-all duration-200 border-b-2 font-medium text-base hover:cursor-pointer
      ${!showDescription
                                    ? 'border-blue-600 text-blue-600 -mb-px bg-blue-100'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 bg-gray-100'}
    `}
                            onClick={() => setShowDescription(false)}
                        >
                            Líneas de entrega
                        </button>
                        <button
                            className={`w-1/2 px-4 py-2 text-center transition-all duration-200 border-b-2 font-medium text-base hover:cursor-pointer
      ${showDescription
                                    ? 'border-blue-600 text-blue-600 -mb-px bg-blue-100'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300  bg-gray-100'}
    `}
                            onClick={() => setShowDescription(true)}
                        >
                            Descripción
                        </button>

                    </div>


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

            >
            </EntityDetailsLayout.Header>
            {
                showDescription ? (<>
                    <DetailsDeliveryOrderAndModelsView />


                </>) : <>
                    {/* Lineas de entrega */}

                    <ListDeliveryLineByDeliveryOrder />

                </>
            }


        </EntityDetailsLayout>
    )
}
