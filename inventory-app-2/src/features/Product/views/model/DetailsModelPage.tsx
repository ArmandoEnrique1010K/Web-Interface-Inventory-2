import { useParams } from 'react-router-dom'
import type { ModelDetailsItem } from '../../types'
import { getModel } from '../../api/ModelAPI'
import { useQuery } from '@tanstack/react-query'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { ButtonLink } from '@/ui/ButtonLink'
import { Button } from '@/ui/Button'
import { useState } from 'react'
import { QRModal } from '../../components/QRModal'
import { ProductChangeStatus } from '../../components/product/ProductChangeStatus';
import { ModelChangeStatus } from '../../components/model/ModelChangeStatus';
import { LeftPanelContainer } from '@/components/LeftPanelContainer'
import { RightPanelContainer } from '@/components/RightPanelContainer'
import { EntityDetailsLayout } from '@/layout/entity/EntityDetailsLayout'

export const DetailsModelPage = () => {
    const { modelId, productId } = useParams()

    const { data, isLoading } = useQuery<ModelDetailsItem>({
        queryKey: ['model-details', modelId],
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
                actions={
                    <>
                        <ButtonLink icon={<PencilSquareIcon />} size="large" to={`/products/${productId}/models/edit/${modelId}`} color="blue" text="Editar modelo" />
                        <ModelChangeStatus from='model-details' modelId={modelId!} size="large" productId={productId!} value={data!.status ? 'Desactivar modelo' : 'Activar modelo'} />
                    </>
                }
            ></EntityDetailsLayout.Header>
            <EntityDetailsLayout.Content>
                <EntityDetailsLayout.Left>
                    <LeftPanelContainer subtitle="Características del modelo">

                        <LeftPanelContainer.DetailsGroup>
                            <LeftPanelContainer.Detail label="ID">
                                {data.id}
                            </LeftPanelContainer.Detail>
                            <LeftPanelContainer.Detail label="Nombre">
                                {data.name}
                            </LeftPanelContainer.Detail>
                            <LeftPanelContainer.Detail label="Fecha de entrada">
                                {data.entryDate}
                            </LeftPanelContainer.Detail>
                            <LeftPanelContainer.Detail label="Fecha de caducidad">
                                {data.caducityDate}
                            </LeftPanelContainer.Detail>
                        </LeftPanelContainer.DetailsGroup>
                        <LeftPanelContainer.Image
                            url={data.imageUrl}
                            name={data.name}
                            legend={`${data.productName}, ${data.name}`}
                        />
                    </LeftPanelContainer>
                </EntityDetailsLayout.Left>
                <EntityDetailsLayout.Right>
                    <RightPanelContainer subtitle={"Pertenece al producto"}>
                        <RightPanelContainer.DetailsGrid>
                            <RightPanelContainer.Detail label="ID">
                                {data.id}
                            </RightPanelContainer.Detail>
                            <RightPanelContainer.Detail label="Nombre">
                                {data.productName}
                            </RightPanelContainer.Detail>
                            {
                                Number(data.productLength) !== 0 && (
                                    <RightPanelContainer.Detail label="Largo">
                                        {data.productLength} cm.
                                    </RightPanelContainer.Detail>
                                )
                            }
                            {
                                Number(data.productWidth) !== 0 && (
                                    <RightPanelContainer.Detail label="Ancho">
                                        {data.productWidth} cm.
                                    </RightPanelContainer.Detail>
                                )
                            }
                            {
                                Number(data.productHeight) !== 0 && (
                                    <RightPanelContainer.Detail label="Altura">
                                        {data.productHeight} cm.
                                    </RightPanelContainer.Detail>
                                )
                            }
                            <RightPanelContainer.Detail label="Categoria">
                                {data.categoryName}
                            </RightPanelContainer.Detail>
                            <RightPanelContainer.Detail label="Tipo">
                                {data.typeName}
                            </RightPanelContainer.Detail>
                            <RightPanelContainer.Detail label="Estado del modelo" isButton>
                                <ProductChangeStatus
                                    productId={productId!}
                                    value={data.status ? 'Activo' : 'Inactivo'}
                                    size={"small"}
                                />
                            </RightPanelContainer.Detail>
                            <RightPanelContainer.Detail label="Codigo QR">
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
                            </RightPanelContainer.Detail>

                            {data.status && (
                                <RightPanelContainer.Detail label="Editar producto">
                                    <ButtonLink
                                        size="small"
                                        text="Editar"
                                        to={`/products/edit/${data.productId}`}
                                        color="blue"
                                    />
                                </RightPanelContainer.Detail>
                            )}

                        </RightPanelContainer.DetailsGrid>

                    </RightPanelContainer>
                </EntityDetailsLayout.Right>

            </EntityDetailsLayout.Content>

        </EntityDetailsLayout>

    )
}
