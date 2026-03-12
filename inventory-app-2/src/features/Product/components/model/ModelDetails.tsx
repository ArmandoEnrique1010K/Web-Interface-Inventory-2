import { useParams } from 'react-router-dom'
import type { ModelDetailsItem } from '../../types'
import { getModel } from '../../api/ModelAPI'
import { useQuery } from '@tanstack/react-query'
import { TitleContainer } from '@/components/TitleContainer'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { ButtonLink } from '@/ui/ButtonLink'
import { Button } from '@/ui/Button'
import { useState } from 'react'
import { QRModal } from '../QRModal'
import { ProductChangeStatus } from '../product/ProductChangeStatus'
import { ModelChangeStatus } from './ModelChangeStatus';

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
        <TitleContainer
            title={data.productName + ", " + data.name}
            buttons={
                <>
                    <ButtonLink icon={<PencilSquareIcon />} size="large" to={`/products/${productId}/models/edit/${modelId}`} color="blue" text="Editar modelo" />
                    <ModelChangeStatus from='model-details' modelId={modelId!} size="large" productId={productId!} value={data!.status ? 'Desactivar modelo' : 'Activar modelo'} />


                </>
            }
        >
            <div className="flex flex-col justify-center items-center">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-8 gap-6 w-full">

                    {/* Características */}
                    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4 lg:col-span-5">
                        <h2 className="text-3xl font-bold">Características del modelo</h2>
                        <div className="space-y-1">
                            <div><span className="font-semibold">ID:</span> {data.id}</div>
                            <div><span className="font-semibold">Nombre:</span> {data.name}</div>
                            <div><span className="font-semibold">Fecha de entrada:</span> {data.entryDate}</div>
                            <div><span className="font-semibold">Fecha de caducidad:</span> {data.caducityDate}</div>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            {/* El tamaño de la imagen es variable */}
                            <div className={`w-full h-auto object-contain bg-gray-50 rounded-xl border flex items-center justify-center overflow-hidden`}>
                                {data.imageUrl
                                    ? (
                                        <img
                                            src={data.imageUrl}
                                            alt={data.name}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    )
                                    : <span className="text-gray-400 text-sm">Sin imagen</span>
                                }
                            </div>

                            {/* <span className="font-semibold">Medidas:</span> {generateSizes({
                                    width: data.productWidth,
                                    length: data.productLength,
                                    height: data.productHeight
                                }) */}
                        </div>
                        <div className='flex flex-col text-lg'>
                            <div><span className="font-semibold">Cantidad disponible:</span> {data.totalQuantityAvailable}</div>
                            <div><span className="font-semibold">Cantidad recibida:</span> {data.totalQuantityReceived}</div>
                            <div><span className="font-semibold">Cantidad entregada:</span> {data.totalQuantityDelivered}</div>
                        </div>
                    </div>


                    {/* Modelo seleccionado */}
                    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4 lg:col-span-3">
                        <h2 className="text-3xl font-bold">Pertenece al producto</h2>
                        {data && (
                            <div className="grid grid-cols-2 gap-y-2 text-sm mt-2">

                                <div className="font-semibold">ID:</div>
                                <div>{data.productId}</div>

                                <div className="font-semibold">Nombre:</div>
                                <div>{data.productName}</div>

                                {
                                    Number(data.productLength) === 0 || <>
                                        <div className="font-semibold">Largo:</div>
                                        <div>{data.productLength} cm.</div>

                                    </>
                                }

                                {
                                    Number(data.productWidth) === 0 || <>
                                        <div className="font-semibold">Ancho:</div>
                                        <div>{data.productWidth} cm.</div>

                                    </>
                                }
                                {
                                    Number(data.productHeight) === 0 || <>
                                        <div className="font-semibold">Altura:</div>
                                        <div>{data.productHeight} cm.</div>

                                    </>
                                }

                                <div className="font-semibold">Categoria:</div>
                                <div>{data.categoryName}</div>

                                <div className="font-semibold">Tipo:</div>
                                <div>{data.typeName}</div>

                                <div className="font-semibold">Estado del producto:</div>
                                <div className="flex justify-start">
                                    <ProductChangeStatus productId={data.productId} value={data.status ? 'Activo' : 'Inactivo'} size={"small"} />
                                </div>

                                <div className="font-semibold">Código QR:</div>
                                <div>
                                    {/* ESTE BOTON MUESTRA EL CODIGO QR EN UNA VENTANA MODAL */}
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
                                        // TODO: CORREGIR EL NOMBRE DEL DOMINIO EN UN FUTURO
                                        url={'http://localhost:5173' + `/product/${data.productId}/model/${data.id}`}
                                        title={`Código QR del producto ${data.productName}, ${data.name}`}
                                    />

                                </div>

                                {
                                    data.status && <>
                                        <div className="font-semibold">Editar producto:</div>

                                        <div>
                                            <ButtonLink
                                                size="small"
                                                text="Editar"
                                                to={`/products/edit/${data.productId}`}
                                                color="blue"
                                            />
                                        </div>

                                    </>
                                }
                            </div>
                        )}
                    </div>

                </div>
            </div>




        </TitleContainer >



    )
}
