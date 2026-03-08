import { useQuery } from "@tanstack/react-query"
import { getProduct } from "../../api/ProductAPI"
import { useParams } from "react-router-dom"
import { TitleContainer } from "@/components/TitleContainer"
import type { ProductItem } from "../../types"
import { listAllModelsByProductId } from "../../api/ModelAPI"
import { ButtonLink } from "@/ui/ButtonLink"
import { generateSizes } from "@/utils/generateSizes"
import { Button } from "@/ui/Button"
import { useSearchParams } from "react-router-dom"
import type { ModelItem } from '../../types/index';
import { TableHeaderContainer } from "@/components/TableHeaderContainer"
import { TableRowContainer } from "@/components/TableRowContainer"
import { BaseTableCell } from "@/components/BaseTableCell"
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline"
import { ProductChangeStatus } from "./ProductChangeStatus"

export const ProductDetails = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const modelIdParam = searchParams.get("modelId")

    const { id } = useParams()
    const { data: productData, isLoading: isProductLoading } = useQuery<ProductItem>({
        queryKey: ['product-details', id],
        queryFn: () => getProduct(id!),
        // Si el id existe, ejecuta la función getProduct, de lo contrario no lo va a ejecutar
        enabled: !!id
    })

    const { data: modelsData = [], isLoading: isModelsLoading, isError: isModelsError } = useQuery({
        queryKey: ['models', id],
        queryFn: () => listAllModelsByProductId(id!),
        enabled: !!id
    })

    // ¿Qué pasa si ponen manualmente ? modelId = 999 ?
    //     No pasa nada.
    // findIndex devolverá "-1" y simplemente veran el primer modelo

    const selectedIndex = modelsData.findIndex(
        (model: ModelItem) => model.id === Number(modelIdParam)
    )
    const idModel = selectedIndex >= 0 ? selectedIndex : 0
    const selectedModel = modelsData[idModel]


    const hasPrevious = idModel > 0
    const hasNext = idModel < modelsData.length - 1

    const handleNext = () => {
        if (idModel < modelsData.length - 1) {
            const nextModel = modelsData[idModel + 1]
            setSearchParams({ modelId: String(nextModel.id) })
        }
    }

    const handlePrevious = () => {
        if (idModel > 0) {
            const prevModel = modelsData[idModel - 1]
            setSearchParams({ modelId: String(prevModel.id) })
        }
    }

    if (isProductLoading || isModelsLoading) {
        return <div>Cargando...</div>
    }

    if (!productData) {
        return <div>Producto no encontrado o desactivado</div>
    }



    // TODO: CORREGIR LA API REST, SI UN PRODUCTO ESTA DESACTIVADO, TODAVIA PUEDE SER EDITADO Y VISTO POR UN ADMINISTRADOR
    // TODO: SI UN PRODUCTO ESTA DESACTIVADO NO PODRA SER VISTO POR LOS USUARIOS
    return (
        <TitleContainer
            title={productData!.name}
            buttons={
                <>
                    <ButtonLink icon={<PlusCircleIcon />} size="large" to={`/products/new-model/${id}`} color="green" text="Añadir modelo" />
                    <ButtonLink icon={<PencilSquareIcon />} size="large" to={`/products/edit/${id}`} color="blue" text="Editar" />
                    {/* TODO: EDITAR ESTE BOTON */}
                    <ProductChangeStatus from='product-details' size="large" productId={id!} value={productData!.status ? 'Desactivar' : 'Activar'} />
                </>
            }
            children={
                <div className="flex flex-col gap-2">

                    <div className="flex flex-col justify-center items-center">
                        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Características */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
                                <h2 className="text-2xl font-bold border-b pb-2">Características</h2>
                                <div className="text-sm space-y-1">
                                    <div><span className="font-semibold">Categoría:</span> {productData!.categoryName}</div>
                                    <div><span className="font-semibold">Tipo:</span> {productData!.typeName}</div>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-72 h-72 bg-gray-50 rounded-xl border flex items-center justify-center overflow-hidden">
                                        {selectedModel?.imageUrl
                                            ? (
                                                <img
                                                    src={selectedModel.imageUrl}
                                                    alt={selectedModel.name}
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            )
                                            : <span className="text-gray-400 text-sm">Sin imagen</span>
                                        }
                                    </div>

                                    <div className="text-sm text-gray-600 text-center">
                                        <span className="font-semibold">Medidas:</span> {generateSizes(productData!)}
                                    </div>
                                </div>
                            </div>
                            {/* Modelo seleccionado */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
                                <h2 className="text-2xl font-bold border-b pb-2">
                                    Modelo seleccionado
                                </h2>
                                {/* Navegación modelos */}
                                <div className="flex items-center justify-center gap-3">
                                    <Button
                                        text="◄"
                                        type="button"
                                        color="blue"
                                        onClick={handlePrevious}
                                        disabled={!hasPrevious}
                                        size="small"
                                    />

                                    <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-lg">
                                        {modelsData.length ? idModel + 1 : 0} de {modelsData.length}
                                    </span>

                                    <Button
                                        text="►"
                                        type="button"
                                        size="small"
                                        color="blue"
                                        onClick={handleNext}
                                        disabled={!hasNext}
                                    />
                                </div>
                                {selectedModel && (
                                    <div className="grid grid-cols-2 gap-y-2 text-sm mt-2">

                                        <div className="font-semibold">ID:</div>
                                        <div>{selectedModel.id}</div>

                                        <div className="font-semibold">Nombre:</div>
                                        <div>{selectedModel.name}</div>

                                        <div className="font-semibold">Fecha entrada:</div>
                                        <div>{selectedModel.entryDate}</div>

                                        <div className="font-semibold">Caducidad:</div>
                                        <div>{selectedModel.caducityDate}</div>

                                        <div className="font-semibold">Disponible:</div>
                                        <div>{selectedModel.totalQuantityAvailable}</div>

                                        <div className="font-semibold">Recibido:</div>
                                        <div>{selectedModel.totalQuantityReceived}</div>

                                        <div className="font-semibold">Entregado:</div>
                                        <div>{selectedModel.totalQuantityDelivered}</div>

                                        <div className="font-semibold">Estado:</div>
                                        <div>
                                            <Button
                                                text={selectedModel.status ? 'Habilitado' : 'Deshabilitado'}
                                                type="button"
                                                color="blue"
                                                size="small"
                                            />
                                        </div>

                                        <div className="font-semibold">QR:</div>
                                        <div>
                                            <Button
                                                text="Obtener QR"
                                                type="button"
                                                color="blue"
                                                size="small"
                                            />
                                        </div>

                                    </div>
                                )}
                            </div>

                        </div>
                    </div>




                    <h2 className="text-2xl">Tabla resumen</h2>

                    <TableHeaderContainer headers={['ID', 'Nombre', 'Fecha de entrada', 'Total disponible']} isError={isModelsError} isEmpty={!modelsData?.length}>
                        {modelsData?.map((model: ModelItem) => (
                            <TableRowContainer key={model.id}>
                                <BaseTableCell data={model.id} />
                                <BaseTableCell data={model.name} />
                                <BaseTableCell data={model.entryDate} />
                                <BaseTableCell data={model.totalQuantityAvailable} />
                            </TableRowContainer>

                        ))}
                    </TableHeaderContainer>
                </div>
            }>

        </TitleContainer>
    )
}
