import { useParams } from 'react-router-dom'
import type { ModelDetailsItem } from '../../types'
import { getModel } from '../../api/ModelAPI'
import { useQuery } from '@tanstack/react-query'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { ButtonLink } from '@/ui/ButtonLink'
import { Button } from '@/ui/Button'
import { useState } from 'react'
import { QRModal } from '../QRModal'
import { ProductChangeStatus } from '../product/ProductChangeStatus'
import { ModelChangeStatus } from './ModelChangeStatus';
import { ElementContainer } from '@/views/ElementContainer'
import { LeftPanelContainer } from '@/components/LeftPanelContainer'
import { RightPanelContainer } from '@/components/RightPanelContainer'

export const ModelDetails = () => {
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
        <ElementContainer
            title={data.productName + ", " + data.name}
            buttonsContainer={
                <>
                    <ButtonLink icon={<PencilSquareIcon />} size="large" to={`/products/${productId}/models/edit/${modelId}`} color="blue" text="Editar modelo" />
                    <ModelChangeStatus from='model-details' modelId={modelId!} size="large" productId={productId!} value={data!.status ? 'Desactivar modelo' : 'Activar modelo'} />
                </>
            }
            leftPanelContainer={
                <LeftPanelContainer subtitle={"Características del modelo"}
                    details={[
                        {
                            name: 'ID',
                            value: `${data.id}`
                        },
                        {
                            name: 'Nombre',
                            value: `${data.name}`
                        },
                        {
                            name: 'Fecha de entrada',
                            value: `${data.entryDate}`
                        },
                        {
                            name: 'Fecha de caducidad',
                            value: `${data.caducityDate}`
                        }
                    ]}
                    image={{
                        url: `${data.imageUrl}`,
                        name: `${data.name}`
                    }}
                    legend={`${data.productName}, ${data.name}`}
                />
            }

            rightPanelContainer={
                <RightPanelContainer
                    subtitle={"Pertenece al producto"}
                    details={[
                        {
                            name: 'ID',
                            value: `${data.productId}`,
                        },
                        {
                            name: 'Nombre',
                            value: `${data.productName}`
                        },
                        {
                            condition: Number(data.productLength) !== 0,
                            name: 'Largo',
                            value: `${data.productLength} cm.`
                        },
                        {
                            condition: Number(data.productWidth) !== 0,
                            name: 'Ancho',
                            value: `${data.productWidth} cm.`
                        },
                        {
                            condition: Number(data.productHeight) !== 0,
                            name: 'Altura',
                            value: `${data.productHeight} cm.`
                        },
                        {
                            name: 'Categoria',
                            value: `${data.categoryName}`
                        },
                        {
                            name: 'Tipo',
                            value: `${data.typeName}`
                        },
                        {
                            name: 'Estado del producto',
                            value: <ProductChangeStatus productId={data.productId} value={data.status ? 'Activo' : 'Inactivo'} size={"small"} />,
                            isButton: true
                        },
                        {
                            name: 'Codigo QR',
                            value: <>
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
                            </>
                        },
                        {
                            condition: data.status,
                            name: 'Editar producto',
                            value: <>
                                <ButtonLink
                                    size="small"
                                    text="Editar"
                                    to={`/products/edit/${data.productId}`}
                                    color="blue"
                                />
                            </>
                        }

                    ]}
                />
            }



        >


        </ElementContainer >



    )
}
