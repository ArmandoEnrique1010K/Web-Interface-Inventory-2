import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import { getStockLot } from "../../api/StockLotAPI";
import type { StockLotDetailsItem } from "../../types";
import { handleFormatDateTime } from "@/utils/handleFormatDateTime";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { useState } from "react";
import { Button } from "@/ui/Button";
import { Modal } from "@/components/Modal";
import { IncreaseStockLotModal } from "../../components/stocklot/IncreaseStockLotModal";
import { DecreaseStockLotModal } from "../../components/stocklot/DecreaseStockLotModal";
import { RecoveryStockLotModal } from "../../components/stocklot/RecoveryStockLotModal";
import { LoaderTransferStockLot } from "../../components/stocklot/LoaderTransferStockLot";
import { PanelContainer } from "@/components/containers/PanelContainer";

export const DetailsStockLotPage = () => {

    const { id: stockLotId } = useParams();

    const { data, isLoading } = useQuery<StockLotDetailsItem>({
        queryKey: ['stocklot', stockLotId],
        queryFn: () => getStockLot(stockLotId!),
        enabled: !!stockLotId
    })

    const [increaseModalOpen, setIncreaseModalOpen] = useState(false);
    const [decreaseModalOpen, setDecreaseModalOpen] = useState(false);
    const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);
    const [transferModalOpen, setTransferModalOpen] = useState(false);

    if (isLoading) {
        return <div>Cargando...</div>
    }

    if (!data) {
        return <div>Lote de stock no encontrado o desactivado</div>
    }


    return (
        <EntityDetailsLayout>
            <EntityDetailsLayout.Header
                title={data.batch} // TODO: PENDIENTE EL MANEJO DEL NOMBRE DEL LOTE
            ></EntityDetailsLayout.Header>

            <EntityDetailsLayout.Content>
                <EntityDetailsLayout.Column>
                    <PanelContainer subtitle="Características del lote de stock">
                        <PanelContainer.DetailsGrid>
                            <PanelContainer.Detail label="ID">
                                {data.id}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Código de lote">
                                {data.batch}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Fecha de creación">
                                {handleFormatDateTime(new Date(data.createdAt))}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Actualizado por última vez">
                                {handleFormatDateTime(new Date(data.updatedAt))}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Creado por">
                                {data.temporary === true ? 'el sistema' : 'un usuario'}
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
                        <PanelContainer
                            subtitle={"Modelo seleccionado"}>
                            <PanelContainer.DetailsGrid>
                                <PanelContainer.Detail label="ID de producto">
                                    {data.productId}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Nombre de producto">
                                    {data.productName}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="ID de modelo">
                                    {data.modelId}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Nombre de producto">
                                    {data.modelName}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Categoria">
                                    {data.categoryName}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Tipo">
                                    {data.typeName}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Importado por">
                                    {data.companyName}
                                </PanelContainer.Detail>
                            </PanelContainer.DetailsGrid>
                        </PanelContainer>
                        <PanelContainer
                            subtitle="Cantidades">
                            <PanelContainer.DetailsGrid>
                                <PanelContainer.Detail label="Cantidad recibida">
                                    {data.quantityReceived}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Cantidad disponible">
                                    {data.quantityAvailable}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Cantidad entregada">
                                    {data.quantityDelivered}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Cantidad perdida">
                                    {data.quantityLost}
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Cantidad recuperada">
                                    {data.quantityRecovered}
                                </PanelContainer.Detail>

                            </PanelContainer.DetailsGrid>

                        </PanelContainer>
                        <PanelContainer
                            subtitle={"Operaciones"}>
                            <PanelContainer.DetailsGrid>
                                <PanelContainer.Detail label="Agregar">
                                    {
                                        <Button
                                            type='button'
                                            size='small'
                                            text='Agregar'
                                            color='green-outline'
                                            onClick={() => {
                                                setIncreaseModalOpen(true)
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
                                            text='Quitar'
                                            color='red-outline'
                                            onClick={() => {
                                                setDecreaseModalOpen(true)
                                            }}
                                            showTextOnMobile
                                        />
                                    }
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Recuperar">
                                    {
                                        <Button
                                            type='button'
                                            size='small'
                                            text='Recuperar'
                                            color='blue-outline'
                                            onClick={() => {
                                                setRecoveryModalOpen(true)
                                            }}
                                            showTextOnMobile
                                        />
                                    }
                                </PanelContainer.Detail>
                                <PanelContainer.Detail label="Transferir">
                                    {
                                        <Button
                                            type='button'
                                            size='small'
                                            text='Transferir'
                                            color='blue-outline'
                                            onClick={() => {
                                                setTransferModalOpen(true)
                                            }}
                                            showTextOnMobile
                                        />

                                    }
                                </PanelContainer.Detail>
                            </PanelContainer.DetailsGrid>
                        </PanelContainer>


                    </EntityDetailsLayout.Grid>

                </EntityDetailsLayout.Column>



            </EntityDetailsLayout.Content>
            {
                increaseModalOpen && stockLotId && <Modal
                    isOpen={increaseModalOpen}
                    onClose={() => {
                        setIncreaseModalOpen(false)
                    }
                    }
                    size='lg'
                    title={`Agregar cantidad al lote de stock #${stockLotId}`}
                    locked
                >
                    <IncreaseStockLotModal stockLotId={stockLotId} showModal={setIncreaseModalOpen} />
                </Modal>
            }
            {
                decreaseModalOpen && stockLotId && <Modal
                    isOpen={decreaseModalOpen}
                    onClose={() => {
                        setDecreaseModalOpen(false)
                    }
                    }
                    size='lg'
                    title={`Disminuir cantidad al lote de stock #${stockLotId}`}
                    locked
                >
                    <DecreaseStockLotModal stockLotId={stockLotId} showModal={setDecreaseModalOpen} />
                </Modal>
            }
            {
                recoveryModalOpen && stockLotId && <Modal
                    isOpen={recoveryModalOpen}
                    onClose={() => {
                        setRecoveryModalOpen(false)
                    }
                    }
                    size='lg'
                    title={`Recuperar cantidad del lote de stock #${stockLotId}`}
                    locked
                >
                    <RecoveryStockLotModal stockLotId={stockLotId} showModal={setRecoveryModalOpen} />
                </Modal>
            }
            {
                transferModalOpen && stockLotId && <Modal
                    isOpen={transferModalOpen}
                    onClose={() => {
                        setTransferModalOpen(false)
                    }
                    }
                    size='lg'
                    title={`Transferir cantidad desde el lote de stock #${stockLotId}`}
                    locked
                >
                    <LoaderTransferStockLot stockLotId={stockLotId} showModal={setTransferModalOpen} />
                </Modal>
            }

        </EntityDetailsLayout>
        //     title={data.batch}
        //     buttons={
        //         <>
        //             <ButtonLink icon={<PlusCircleIcon />} size='large' text='Agregar' to={`/stocklots/${stockLotId}/increase`} color='green' />
        //             <ButtonLink icon={<MinusCircleIcon />} size='large' text='Disminuir' to={`/stocklots/${stockLotId}/decrease`} color='red' />
        //             <ButtonLink icon={<SquaresPlusIcon />} size='large' text='Recuperar' to={`/stocklots/${stockLotId}/recovery`} color='blue' />
        //             <ButtonLink icon={<ArrowPathIcon />} size='large' text='Transferir' to={`/stocklots/${stockLotId}/transfer`} color='blue' />

        //         </>
        //     }
        // >


    )
}
