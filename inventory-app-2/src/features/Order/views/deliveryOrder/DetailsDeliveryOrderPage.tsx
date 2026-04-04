import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import {
    getDeliveryOrder,
    getDeliveryOrderForClient,
} from "../../api/DeliveryOrderAPI";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { handleFormatDateTimeText } from "@/utils/handleFormatDateTimeText";
import { useState } from "react";
import { DetailsModelsByDeliveryOrderView } from "../modelDeliveryOrder/DetailsModelsByDeliveryOrderView";
import { ListDeliveryLineByDeliveryOrder } from "../deliveryLine/ListDeliveryLineByDeliveryOrder";
import { ButtonLink } from "@/ui/ButtonLink";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import type {
    DeliveryOrderClientDetailsItem,
    DeliveryOrderDetailsItem,
} from "../../schemas/items";

export const DetailsDeliveryOrderPage = () => {
    // ESTABLECE SI VA A MOSTRAR LA DESCRIPCION O LAS ORDENES DE ENTREGA
    const [showDescription, setShowDescription] = useState(false);

    const { pathname } = useLocation();

    const from = pathname.includes("pending")
        ? "pending"
        : pathname.includes("my-orders")
          ? "my-orders"
          : null;

    // const queryParams = new URLSearchParams(search);
    // const isPendingOrder = queryParams.get("from") === "pending";
    // const isMyOrdersOrder = queryParams.get("from") === "my-orders";

    // Obtiene la orden de entrega por ID
    const { id: deliveryOrderIdStr } = useParams();

    const deliveryOrderId = +deliveryOrderIdStr!;

    const { data: deliveryOrderData, isLoading: isDeliveryOrderDataLoading } =
        useQuery<DeliveryOrderDetailsItem | DeliveryOrderClientDetailsItem>({
            queryKey: ["deliveryOrder", deliveryOrderId],
            queryFn: () =>
                from && from === "my-orders"
                    ? getDeliveryOrderForClient(deliveryOrderId!)
                    : getDeliveryOrder(deliveryOrderId!),
            enabled: !!deliveryOrderId,
        });
    //

    const getRouteToOrders = () => {
        if (from === "pending") {
            return `/orders/pending`;
        }

        if (from === "my-orders") {
            return `/orders/my-orders`;
        }
        return `/orders`;
    };

    if (isDeliveryOrderDataLoading) {
        return <div>Cargando...</div>;
    }

    if (!deliveryOrderData) {
        return (
            <div>
                Orden de entrega no encontrada o desactivada en
                DeliveryOrderPage
            </div>
        );
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
                                    <ButtonLink
                                        size={"large"}
                                        text={"Volver a ordenes"}
                                        to={getRouteToOrders()}
                                        color={"gray"}
                                        icon={<ArrowLeftCircleIcon />}
                                        showTextOnMobile
                                    />
                                </div>
                                <div className="w-full flex flex-row">
                                    <button
                                        className={`w-1/2 px-4 py-2 text-center transition-all  duration-200 border-b-2 font-medium text-base hover:cursor-pointer
      ${
          !showDescription
              ? "border-blue-600 text-blue-600 -mb-px bg-blue-100"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 bg-gray-100"
      }
    `}
                                        onClick={() =>
                                            setShowDescription(false)
                                        }
                                    >
                                        Líneas de entrega
                                    </button>
                                    <button
                                        className={`w-1/2 px-4 py-2 text-center transition-all duration-200 border-b-2 font-medium text-base hover:cursor-pointer
      ${
          showDescription
              ? "border-blue-600 text-blue-600 -mb-px bg-blue-100"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300  bg-gray-100"
      }
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
                    // SI EXISTE LA PROPIEDAD createdByUser, SE TRATA DE QUE ESTA HACIENDO UN LLAMADO HACIA getDeliveryOrderForClient
                    from !== "my-orders" &&
                    "createdByUser" in deliveryOrderData && (
                        // SOLAMENTE ESTAS PROPIEDADES EXISTIRAN SI NO SE TRATA DE LA ORDEN DE ENTREGA POR CLIENTE
                        <div className="text-right">
                            <div>
                                Creado por: {deliveryOrderData.createdByUser}
                            </div>
                            <div className="">
                                (
                                {
                                    handleFormatDateTimeText(
                                        new Date(deliveryOrderData.createdAt),
                                    ).date
                                }{" "}
                                {
                                    handleFormatDateTimeText(
                                        new Date(deliveryOrderData.createdAt),
                                    ).hour
                                }
                                )
                            </div>
                            <div>
                                Actualizado por:{" "}
                                {deliveryOrderData.updatedByUser}
                            </div>
                            <div className="">
                                (
                                {
                                    handleFormatDateTimeText(
                                        new Date(deliveryOrderData.updatedAt),
                                    ).date
                                }{" "}
                                {
                                    handleFormatDateTimeText(
                                        new Date(deliveryOrderData.updatedAt),
                                    ).hour
                                }
                                )
                            </div>
                        </div>
                    )
                }
            ></EntityDetailsLayout.Header>

            {/* showDescription sirve para mostrar la descripcion de la orden de entrega, en el que se encuentra los modelos por orden de entrega */}
            {showDescription ? (
                <>
                    <DetailsModelsByDeliveryOrderView />
                </>
            ) : (
                <>
                    {/* Lineas de entrega */}
                    <ListDeliveryLineByDeliveryOrder
                        deliveryOrderStatus={deliveryOrderData.orderStatus}
                    />
                </>
            )}
        </EntityDetailsLayout>
    );
};
