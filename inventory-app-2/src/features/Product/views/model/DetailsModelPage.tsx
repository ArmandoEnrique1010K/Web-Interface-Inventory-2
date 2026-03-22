import { useParams } from 'react-router-dom'
import type { ModelDetailsItem } from '../../types'
import { getModel } from '../../api/ModelAPI'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/ui/Button'
import { useState } from 'react'
import { QRModal } from '../../components/QRModal'
import { StatusProductButton } from '../../components/product/StatusProductButton';
import { StatusModelButton } from '../../components/model/StatusModelButton';
import { EntityDetailsLayout } from '@/layout/entity/EntityDetailsLayout'
import { PanelContainer } from '@/components/containers/PanelContainer'
import { Modal } from '@/components/Modal'
import { LoaderModel } from '../../components/model/LoaderModel'
import { LoaderProduct } from '../../components/product/LoaderProduct'

export const DetailsModelPage = () => {
    const { modelId, productId } = useParams()

    const [editCurrentModelModalOpen, setEditCurrentModelModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const { data, isLoading } = useQuery<ModelDetailsItem>({
        queryKey: ['model', modelId ? +modelId : 0],
        queryFn: () => getModel(modelId!),
        // Si el id existe, ejecuta la función getProduct, de lo contrario no lo va a ejecutar
        enabled: !!modelId
    })
    const [isQRModalOpen, setIsQRModalOpen] = useState(false)
    const handleOpenQR = () => {
        setIsQRModalOpen(true)
    }

    if (isLoading) {
        return <div>Cargando...</div>
    }

    if (!data) {
        return <div>Modelo no encontrado o desactivado</div>
    }

    return (
        <EntityDetailsLayout>
            <EntityDetailsLayout.Header
                title={data.productName + ", " + data.name}
            ></EntityDetailsLayout.Header>
            <EntityDetailsLayout.Content>
                <EntityDetailsLayout.Column>
                    <PanelContainer subtitle="Características del modelo">

                        <PanelContainer.DetailsGrid>
                            <PanelContainer.Detail label="ID">
                                {data.id}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Nombre">
                                {data.name}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Fecha de entrada">
                                {data.entryDate}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Fecha de caducidad">
                                {data.caducityDate}
                            </PanelContainer.Detail>
                        </PanelContainer.DetailsGrid>
                        <PanelContainer.Image
                            url={data.imageUrl}
                            name={data.name}
                            legend={`${data.productName}, ${data.name}`}
                        />

                        <PanelContainer.DetailsGrid>
                            <PanelContainer.Detail label="Editar modelo">
                                <Button
                                    size="small"
                                    text="Editar"
                                    color="blue"
                                    type="button"
                                    showTextOnMobile
                                    onClick={() => {
                                        setEditCurrentModelModalOpen(true)
                                    }}
                                />
                                {
                                    editCurrentModelModalOpen && modelId && <Modal
                                        isOpen={editCurrentModelModalOpen}
                                        onClose={() => {
                                            setEditCurrentModelModalOpen(false)
                                        }
                                        }
                                        size='lg'
                                        title={`Editar el modelo #${productId}`}
                                    >

                                        <LoaderModel modelId={+modelId} setEditCurrentModelModalOpen={setEditCurrentModelModalOpen} />
                                    </Modal>
                                }


                            </PanelContainer.Detail>
                            {/* <StatusModelButton 
                            from='model-details' 
                            modelId={modelId!} size="large" productId={productId!} value={data!.status ? 'Desactivar modelo' : 'Activar modelo'} /> */}

                            <PanelContainer.Detail label="Estado del modelo">
                                <StatusModelButton
                                    from='product-details'
                                    modelId={modelId!} size="small"
                                    productId={productId!}
                                    value={data.status ? 'Activo' : 'Inactivo'}
                                />

                            </PanelContainer.Detail>

                        </PanelContainer.DetailsGrid>


                    </PanelContainer>
                </EntityDetailsLayout.Column>
                <EntityDetailsLayout.Column>
                    <PanelContainer subtitle={"Pertenece al producto"}>
                        <PanelContainer.DetailsGrid>
                            <PanelContainer.Detail label="ID">
                                {data.id}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Nombre">
                                {data.productName}
                            </PanelContainer.Detail>
                            {
                                Number(data.productLength) !== 0 && (
                                    <PanelContainer.Detail label="Largo">
                                        {data.productLength} cm.
                                    </PanelContainer.Detail>
                                )
                            }
                            {
                                Number(data.productWidth) !== 0 && (
                                    <PanelContainer.Detail label="Ancho">
                                        {data.productWidth} cm.
                                    </PanelContainer.Detail>
                                )
                            }
                            {
                                Number(data.productHeight) !== 0 && (
                                    <PanelContainer.Detail label="Altura">
                                        {data.productHeight} cm.
                                    </PanelContainer.Detail>
                                )
                            }
                            <PanelContainer.Detail label="Categoria">
                                {data.categoryName}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Tipo">
                                {data.typeName}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Codigo QR">
                                <Button
                                    text="Obtener QR"
                                    type="button"
                                    color="blue"
                                    size="small"
                                    onClick={handleOpenQR}
                                />

                                <QRModal
                                    isOpen={isQRModalOpen}
                                    onClose={() => setIsQRModalOpen(false)}
                                    url={import.meta.env.VITE_FRONTEND_DOMAIN + `/product/${data.productId}/model/${data.id}`}
                                    title={`Código QR del producto ${data.productName}, ${data.name}`}
                                />
                            </PanelContainer.Detail>

                            <PanelContainer.Detail label="Estado del modelo" isButton>
                                <StatusProductButton
                                    productId={productId!}
                                    value={data.status ? 'Activo' : 'Inactivo'}
                                    size={"small"}
                                />
                            </PanelContainer.Detail>
                            {data.status && (
                                <PanelContainer.Detail label="Editar producto">
                                    {/* <ButtonLink
                                        size="small"
                                        text="Editar"
                                        to={`/products/edit/${data.productId}`}
                                        color="blue"
                                    /> */}
                                    <Button
                                        size="small"
                                        text="Editar"
                                        // to={`/products/${productId}/models/edit/${selectedModel.id}`}
                                        color="blue"
                                        type="button"
                                        showTextOnMobile
                                        onClick={() => {
                                            setEditModalOpen(true)
                                        }}
                                    />
                                    {
                                        editModalOpen && productId && modelId && <Modal
                                            isOpen={editModalOpen}
                                            onClose={() => {
                                                setEditModalOpen(false)
                                            }
                                            }
                                            size='lg'
                                            title={`Editar el producto #${productId}`}
                                        >

                                            <LoaderProduct modelId={+modelId} productId={productId.toString()} closeModal={setEditModalOpen} />
                                        </Modal>
                                    }
                                </PanelContainer.Detail>
                            )}

                        </PanelContainer.DetailsGrid>

                    </PanelContainer>
                </EntityDetailsLayout.Column>

            </EntityDetailsLayout.Content>

        </EntityDetailsLayout>

    )
}
