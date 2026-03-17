import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import { getStockLot } from "../../api/StockLotAPI";
import type { StockLotDetailsItem } from "../../types";
import { ListElementsContainer } from "@/views/ListElementsContainer";
import { handleFormatDateTime } from "@/utils/handleFormatDateTime";
import { ButtonLink } from "@/ui/ButtonLink";
import { ArrowPathIcon, MinusCircleIcon, PlusCircleIcon, SquaresPlusIcon } from "@heroicons/react/24/outline";

export const StockLotDetails = () => {

    const { id: stockLotId } = useParams();

    const { data, isLoading } = useQuery<StockLotDetailsItem>({
        queryKey: ['stock-lot-details', stockLotId],
        queryFn: () => getStockLot(stockLotId!),
        enabled: !!stockLotId
    })

    if (isLoading) {
        return <div>Cargando...</div>
    }

    if (!data) {
        return <div>Lote de stock no encontrado o desactivado</div>
    }


    return (
        <ListElementsContainer
            title={data.batch}
            buttons={
                <>
                    <ButtonLink icon={<PlusCircleIcon />} size='large' text='Agregar' to={`/stocklots/${stockLotId}/increase`} color='green' />
                    <ButtonLink icon={<MinusCircleIcon />} size='large' text='Disminuir' to={`/stocklots/${stockLotId}/decrease`} color='red' />
                    <ButtonLink icon={<SquaresPlusIcon />} size='large' text='Recuperar' to={`/stocklots/${stockLotId}/recovery`} color='blue' />
                    <ButtonLink icon={<ArrowPathIcon />} size='large' text='Transferir' to={`/stocklots/${stockLotId}/transfer`} color='blue' />

                </>
            }
        >
            <div className="flex flex-col justify-center items-center">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-8 gap-6 w-full">

                    {/* Características */}
                    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4 lg:col-span-5">
                        <h2 className="text-3xl font-bold">Características del lote de stock</h2>
                        <div className="space-y-1">
                            <div><span className="font-semibold">ID:</span> {data.id}</div>
                            <div><span className="font-semibold">Código:</span> {data.batch}</div>
                            <div><span className="font-semibold">Fecha de creación:</span> {handleFormatDateTime(new Date(data.createdAt))}</div>
                            <div><span className="font-semibold">Fecha de actualización:</span> {handleFormatDateTime(new Date(data.updatedAt))}</div>
                            <div><span className="font-semibold">Creado por: </span> {data.temporary === true ? 'el sistema' : 'un usuario'}</div>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            {/* El tamaño de la imagen es variable */}
                            <div className={`w-full h-auto object-contain bg-gray-50 rounded-xl border flex items-center justify-center overflow-hidden`}>
                                {data.modelImageUrl
                                    ? (
                                        <img
                                            src={data.modelImageUrl}
                                            alt={data.modelName}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    )
                                    : <span className="text-gray-400 text-sm">Sin imagen</span>
                                }
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div><span className="font-semibold">Cantidad recibida:</span> {data.quantityReceived}</div>
                            <div><span className="font-semibold">Cantidad disponible:</span> {data.quantityAvailable}</div>
                            <div><span className="font-semibold">Cantidad entregada:</span> {data.quantityDelivered}</div>
                            <div><span className="font-semibold">Cantidad perdida:</span> {data.quantityLost}</div>
                            <div><span className="font-semibold">Cantidad recuperada:</span> {data.quantityRecovered}</div>

                        </div>
                    </div>


                    {/* Modelo seleccionado */}
                    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4 lg:col-span-3">
                        <h2 className="text-3xl font-bold">Pertenece al producto</h2>
                        {data && (
                            <div className="grid grid-cols-2 gap-y-2 text-sm mt-2">

                                <div className="font-semibold">ID de producto:</div>
                                <div>{data.productId}</div>

                                <div className="font-semibold">Nombre de producto:</div>
                                <div>{data.productName}</div>

                                <div className="font-semibold">ID de modelo:</div>
                                <div>{data.modelId}</div>

                                <div className="font-semibold">Modelo:</div>
                                <div>{data.modelName}</div>

                                <div className="font-semibold">Categoria:</div>
                                <div>{data.categoryName}</div>

                                <div className="font-semibold">Tipo:</div>
                                <div>{data.typeName}</div>

                                <div className="font-semibold">Empresa importadora:</div>
                                <div>{data.companyName}</div>

                            </div>
                        )}
                    </div>

                </div>
            </div>




        </ListElementsContainer >


    )
}
