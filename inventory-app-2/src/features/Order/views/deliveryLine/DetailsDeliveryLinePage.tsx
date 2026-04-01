import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom"
import { getDeliveryLine } from "../../api/DeliveryLineAPI";
import type { DeliveryLineDetailsItem } from "../../types";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { PanelContainer } from "@/components/containers/PanelContainer";
import { handleFormatDateTimeWithoutT } from '../../../../utils/handleFormatDateTime';
import { handleFormatDateTimeText } from "@/utils/handleFormatDateTimeText";
import { Button } from "@/ui/Button";
import { useEffect, useState, } from "react";
import { Modal } from "@/components/Modal";
import { EditDeliveryLineModal } from "../../components/deliveryLine/EditDeliveryLineModal";
import { AllocateStockDeliveryLineModal } from "../../components/deliveryLine/AllocateStockDeliveryLineModal";
import { getStockLotsByDeliveryLine } from "../../api/StockLotsDeliveryLineAPI";
import { TableContainer } from "@/components/TableContainer";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { LostDeliveryLineModal } from "../../components/deliveryLine/LostDeliveryLineModal";
import { ReturnDeliveryLineModal } from "../../components/deliveryLine/ReturnDeliveryLineModal";
import { ButtonLink } from "@/ui/ButtonLink";
import { SendDeliveryLineButton } from "../../components/deliveryLine/SendDeliveryLineButton";
import { CancelDeliveryLineButton } from "../../components/deliveryLine/CancelDeliveryLineButton";
import { MissingDeliveryLineButton } from "../../components/deliveryLine/MissingDeliveryLineButton";

type Props = {
    from?: 'pending' | 'my-orders'
}

export const DetailsDeliveryLinePage = ({ from }: Props) => {

    const { deliveryLineId, deliveryOrderId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading } = useQuery<DeliveryLineDetailsItem>({
        queryKey: ['deliveryLine', deliveryLineId ? +deliveryLineId : 0],
        queryFn: () => getDeliveryLine(deliveryLineId!),
        enabled: !!deliveryLineId,
        retry: 0
    })

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [lostModalOpen, setLostModalOpen] = useState(false);
    const [returnModalOpen, setReturnModalOpen] = useState(false);

    const [allocateStockModalOpen, setAllocateStockModalOpen] = useState(false);

    // Obtener las cantidades tomadas
    const { data: stockLotsByDeliveryLineData, isError: stockLotDeliveryLineError } = useQuery({
        queryKey: ['deliveryLine', 'stockLots', deliveryLineId],
        queryFn: () => getStockLotsByDeliveryLine(deliveryLineId!),
        enabled: !!deliveryLineId,
        retry: 0
    })
    const content = stockLotsByDeliveryLineData || []

    const buildStartRoutePath = () => {
        if (from === 'pending') {
            return `/orders/pending/${deliveryOrderId}`
        }

        if (from === 'my-orders') {
            return `/orders/my-orders/${deliveryOrderId}`
        }
        return `/orders/${deliveryOrderId}`
    }


    // Nunca navegues cuando se renderiza el componente
    useEffect(() => {
        if (stockLotDeliveryLineError) {
            navigate(buildStartRoutePath())
        }
    }, [stockLotDeliveryLineError])

    useEffect(() => {
        if (!data && !isLoading) {
            navigate(buildStartRoutePath())
        }
    }, [data, isLoading])

    if (isLoading) {
        return <div>Cargando...</div>
    }

    if (!data) {
        return (<div>Error no controlado</div>)


        // TODO: MEJORAR ESTE MENSAJE DE ERROR
        // return (
        //     <div className="text-center p-8">
        //         <h2 className="text-xl font-semibold text-red-600 mb-2">
        //             Error de Validación
        //         </h2>
        //         <p className="text-gray-600 mb-4">
        //             La linea de entrega #{deliveryLineId} no pertenece a la orden de entrega #{deliveryOrderId}.
        //         </p>
        //         <Link to={'/'}>
        //             IR A INICIO
        //         </Link>
        //     </div>

        // )
    }

    return (
        <EntityDetailsLayout>
            <EntityDetailsLayout.Header
                title={`Linea de entrega #${deliveryLineId}`}
                actions={
                    <>
                        <Button
                            type="button"
                            size="large"
                            text="Editar linea"
                            color="blue"
                            onClick={() => {
                                setEditModalOpen(true)
                            }}
                            showTextOnMobile
                        />
                        <ButtonLink
                            size={"large"}
                            text={"Volver a orden"}
                            to={buildStartRoutePath()}
                            color={"gray"}
                            showTextOnMobile
                        />
                    </>
                }
                textDetails={
                    <div className="text-right">
                        <div>
                            Actualizado por: {data.userUpdaterFullname}
                        </div>
                        <div className="">
                            ({handleFormatDateTimeText(new Date(data.updatedAt)).date}{" "}
                            {handleFormatDateTimeText(new Date(data.updatedAt)).hour})
                        </div>

                    </div>

                }
            ></EntityDetailsLayout.Header>

            {
                editModalOpen && deliveryLineId && <Modal
                    isOpen={editModalOpen}
                    onClose={() => {
                        setEditModalOpen(false)
                    }}
                    size="lg"
                    title={`Editar linea de entrega ${deliveryLineId}`}
                    locked
                >
                    <EditDeliveryLineModal
                        setEditModalOpen={setEditModalOpen}
                        deliveryLineId={deliveryLineId}
                        deliveryOrderId={deliveryOrderId!}
                        limitDate={data.limitDate}
                        requiredQuantity={data.requiredQuantity}
                    />
                </Modal>
            }


            <EntityDetailsLayout.Content columns={2}>
                <EntityDetailsLayout.Column>
                    <PanelContainer subtitle="Caracteristicas del producto">

                        <PanelContainer.DetailsGrid>
                            <PanelContainer.Detail label="Nombre del producto">
                                {data.productName}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="ID de modelo">
                                {data.modelId}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Nombre del modelo">
                                {data.modelName}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Categoria">
                                {data.categoryName}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Tipo">
                                {data.typeName}
                            </PanelContainer.Detail>
                        </PanelContainer.DetailsGrid>
                        <PanelContainer.Image
                            url={data.modelImageUrl}
                            name={data.modelName}
                            legend={`${data.productName}, ${data.modelName}`}
                        />


                    </PanelContainer>
                </EntityDetailsLayout.Column>
                <EntityDetailsLayout.Column>
                    <EntityDetailsLayout.Grid>
                        <PanelContainer subtitle="Descripción de la linea">
                            <PanelContainer.DetailsGrid>
                                <PanelContainer.Detail label="Fecha limite de entrega">
                                    {handleFormatDateTimeWithoutT(new Date(data.limitDate))}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Estado">
                                    {data.lineStatus}
                                </PanelContainer.Detail>

                                <PanelContainer.Detail label="Cantidad requerida">
                                    {data.requiredQuantity}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Cantidad preparada">
                                    {data.deliveredQuantity}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Cantidad pendiente">
                                    {data.pendingQuantity}
                                </PanelContainer.Detail>
                            </PanelContainer.DetailsGrid>
                        </PanelContainer>
                    </EntityDetailsLayout.Grid>

                    {
                        // TODO: SERA POSIBLE TRASLADAR LAS VENTANAS MODALES A OTRO COMPONENTE DE TAL MANERA QUE EL NUEVO COMPONENTE REPRESENTE EL BOTON PARA ABRIR LA VENTANA MODAL?
                        from !== 'my-orders' && (
                            <PanelContainer subtitle="Operaciones">
                                <PanelContainer.DetailsGrid>
                                    <PanelContainer.Detail label="Distribuir">
                                        {
                                            <Button
                                                type='button'
                                                size='small'
                                                text='Distribuir'
                                                color='green-outline'
                                                onClick={() => {
                                                    setAllocateStockModalOpen(true)
                                                }}
                                                showTextOnMobile
                                            />
                                        }
                                    </PanelContainer.Detail>
                                    <PanelContainer.Detail label="Quitar">
                                        {
                                            <Button
                                                type='button'
                                                size='small'
                                                text='Quitar / eliminar'
                                                color='red-outline'
                                                onClick={() => {
                                                    setLostModalOpen(true)
                                                }}
                                                showTextOnMobile
                                            />
                                        }
                                    </PanelContainer.Detail>
                                    <PanelContainer.Detail label="Devolver">
                                        {
                                            <Button
                                                type='button'
                                                size='small'
                                                text='Devolver'
                                                color='blue-outline'
                                                onClick={() => {
                                                    setReturnModalOpen(true)
                                                }}
                                                showTextOnMobile
                                            />
                                        }
                                    </PanelContainer.Detail>
                                    <PanelContainer.Detail label="Entregar">
                                        <SendDeliveryLineButton
                                            deliveryLineId={deliveryLineId!}
                                            deliveryOrderId={deliveryOrderId!}
                                            deliveryLineStatus={data.lineStatus}
                                        />
                                    </PanelContainer.Detail>
                                    <PanelContainer.Detail label="Eliminar">
                                        <CancelDeliveryLineButton
                                            deliveryLineId={deliveryLineId!}
                                            deliveryOrderId={deliveryOrderId!}
                                            deliveryLineStatus={data.lineStatus}
                                        />
                                    </PanelContainer.Detail>
                                    <PanelContainer.Detail label="Reportar perdida">
                                        <MissingDeliveryLineButton
                                            deliveryLineId={deliveryLineId!}
                                            deliveryOrderId={deliveryOrderId!}
                                            deliveryLineStatus={data.lineStatus}
                                        />
                                    </PanelContainer.Detail>

                                </PanelContainer.DetailsGrid>
                            </PanelContainer>

                        )
                    }



                </EntityDetailsLayout.Column>
            </EntityDetailsLayout.Content >


            {
                // VENTANAS MODALES POR CADA UNA DE LAS OPERACIONES
                allocateStockModalOpen && deliveryLineId && <Modal
                    isOpen={allocateStockModalOpen}
                    onClose={() => {
                        setAllocateStockModalOpen(false)
                    }
                    }
                    size='lg'
                    title={`Distribuir cantidad desde los lotes de stock a la linea #${deliveryLineId}`}
                    locked
                >
                    <AllocateStockDeliveryLineModal
                        setAllocateStockModalOpen={setAllocateStockModalOpen}
                        deliveryLineId={deliveryLineId}
                        deliveryOrderId={deliveryOrderId!}
                        modelId={data.modelId}
                    />

                </Modal>
            }

            {
                lostModalOpen && deliveryLineId && <Modal
                    isOpen={lostModalOpen}
                    onClose={() => {
                        setLostModalOpen(false)
                    }}
                    size="lg"
                    title={`Quitar cantidad de la linea #${deliveryLineId}`}
                    locked
                >
                    <LostDeliveryLineModal
                        setLostModalOpen={setLostModalOpen}
                        deliveryLineId={deliveryLineId}
                        deliveryOrderId={deliveryOrderId!}

                    />
                </Modal>
            }

            {
                returnModalOpen && deliveryLineId && <Modal
                    isOpen={returnModalOpen}
                    onClose={() => {
                        setReturnModalOpen(false)
                    }}
                    size="lg"
                    title={`Devolver cantidad de la linea #${deliveryLineId}`}
                    locked
                >
                    <ReturnDeliveryLineModal
                        setReturnModalOpen={setReturnModalOpen}
                        deliveryLineId={deliveryLineId}
                        deliveryOrderId={deliveryOrderId!}

                    />
                </Modal>
            }
            {/* DETALLA DE QUE LOTE DE ENTREGA SE HA TOMADO PARA COMPLETAR LA LINEA DE ENTREGA */}

            {
                from !== 'my-orders' && (
                    <EntityDetailsLayout.Content columns={1}>
                        <EntityDetailsLayout.Column>
                            <TableContainer
                                title="Historial de las cantidades tomadas de los lotes de stock"
                                headers={['ID', 'Cantidad', 'Fecha', 'Código de lote de stock']}
                                isError={stockLotDeliveryLineError}
                                isEmpty={!content.length}
                            >
                                {
                                    content?.map((stockLot) => {
                                        return <TableRowContainer key={stockLot.id}>
                                            <BaseTableCell data={stockLot.id} />
                                            <BaseTableCell data={stockLot.quantityUsed} />
                                            <BaseTableCell data={handleFormatDateTimeWithoutT(new Date(stockLot.createdAt))} />
                                            <BaseTableCell data={stockLot.stockLotBatch} />

                                        </TableRowContainer>
                                    })
                                }

                            </TableContainer>
                        </EntityDetailsLayout.Column>
                    </EntityDetailsLayout.Content>
                )
            }

        </EntityDetailsLayout >
    )
}
