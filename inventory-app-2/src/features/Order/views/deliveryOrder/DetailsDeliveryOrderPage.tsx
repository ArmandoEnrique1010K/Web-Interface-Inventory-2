import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getDeliveryOrder, getDeliveryOrderForClient } from "../../api/DeliveryOrderAPI";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { type DeliveryOrderDetailsItem, type OrderStatusEnum } from "../../types";
import { handleFormatDateTimeText } from "@/utils/handleFormatDateTimeText";
import { useState } from "react";
import { DetailsDeliveryOrderAndModelsView } from "../../components/deliveryOrder/DetailsDeliveryOrderAndModelsView";
import { ListDeliveryLineByDeliveryOrder } from "../../components/deliveryOrder/ListDeliveryLineByDeliveryOrder";
import { ButtonLink } from "@/ui/ButtonLink";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";

type Props = {
    from?: 'pending' | 'my-orders'
}

export const DetailsDeliveryOrderPage = ({ from }: Props) => {

    // ESTABLECE SI VA A MOSTRAR LA DESCRIPCION O LAS ORDENES DE ENTREGA
    const [showDescription, setShowDescription] = useState(false);

    // Obtiene la orden de entrega por ID
    const { id: deliveryOrderId } = useParams();

    const { data: deliveryOrderData, isLoading: isDeliveryOrderDataLoading } = useQuery<DeliveryOrderDetailsItem>({
        queryKey: ['deliveryOrder', deliveryOrderId],
        queryFn: () => from === 'my-orders' ? getDeliveryOrderForClient(deliveryOrderId!) : getDeliveryOrder(deliveryOrderId!),
        enabled: !!deliveryOrderId
    })
    // 

    const getRouteToOrders = () => {
        if (from === 'pending') {
            return `/orders/pending`
        }

        if (from === 'my-orders') {
            return `/orders/my-orders`
        }
        return `/orders`

    }


    if (isDeliveryOrderDataLoading) {
        return <div>Cargando...</div>
    }

    if (!deliveryOrderData) {
        return <div>a</div>
    }

    return (
        <EntityDetailsLayout>
            <EntityDetailsLayout.Header
                title={`Orden de entrega #${deliveryOrderId}`}
                actions={
                    <>
                        <div className="w-full">
                            <div className=" border-b border-gray-200  ">
                                <div className="pb-6">
                                    <ButtonLink size={'large'} text={'Volver a ordenes'} to={getRouteToOrders()} color={'gray'} icon={<ArrowLeftCircleIcon />} showTextOnMobile />

                                </div>
                                <div className="w-full flex flex-row">
                                    <button
                                        className={`w-1/2 px-4 py-2 text-center transition-all  duration-200 border-b-2 font-medium text-base hover:cursor-pointer
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

                            </div>
                        </div>

                    </>

                }

                textDetails={
                    from !== 'my-orders' && (
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

                    )
                }

            >
            </EntityDetailsLayout.Header>
            {
                showDescription ? (<>
                    <DetailsDeliveryOrderAndModelsView from={from} />


                </>) : <>
                    {/* Lineas de entrega */}

                    <ListDeliveryLineByDeliveryOrder from={from} deliveryOrderStatus={deliveryOrderData.orderStatus as OrderStatusEnum} />

                </>
            }


        </EntityDetailsLayout>
    )
}
