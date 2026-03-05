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

    const { data: modelsData = [], isLoading: isModelsLoading } = useQuery({
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
                    <ButtonLink size="large" to={`/products/new-model/${id}`} color="green" text="Añadir modelo" />
                    <ButtonLink size="large" to={`/products/edit/${id}`} color="blue" text="Editar" />
                    {/* <ButtonLink size="large" to={`/products/status/${id}`} color="red" text={productData!.status ? 'Desactivar' : 'Activar'} /> */}

                    <ProductChangeStatus from='product-details' productId={id!} value={productData!.status ? 'Activo' : 'Inactivo'} />
                </>
            }
            children={
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold">Características</h2>

                    <div className="flex flex-row gap-4">
                        <div className="flex-col">
                            <div>Categoria: {productData!.categoryName}</div>
                            <div>Tipo: {productData!.typeName}</div>
                            <div className="flex flex-col">
                                <div className="size-80 bg-white rounded-4xl p-6 flex items-center justify-center">
                                    {selectedModel?.imageUrl
                                        ? <img src={selectedModel.imageUrl} alt={selectedModel.name} className="max-h-full max-w-full object-contain" />
                                        : <span>Sin imagen</span>
                                    }
                                </div>
                                <div>Medidas: {generateSizes(productData!)}</div>
                            </div>
                        </div>
                        <div className="flex-col">
                            <h2 className="text-2xl font-bold">Modelos</h2>
                            <div className="flex flex-row gap-2">
                                <Button
                                    text="ANTERIOR"
                                    type="button"
                                    color="blue"
                                    onClick={handlePrevious}
                                    disabled={!hasPrevious}
                                />

                                <Button
                                    text={`${modelsData.length ? idModel + 1 : 0} de ${modelsData.length}`}
                                    type="button"
                                    color="green"
                                    disabled
                                />

                                <Button
                                    text="SIGUIENTE"
                                    type="button"
                                    color="blue"
                                    onClick={handleNext}
                                    disabled={!hasNext}
                                />
                            </div>
                            {selectedModel && (
                                <div className="flex flex-col gap-1 text-sm">
                                    <div>ID modelo: {selectedModel.id}</div>
                                    <div>Nombre modelo: {selectedModel.name}</div>
                                    <div>Fecha de entrada: {selectedModel.entryDate}</div>
                                    <div>Fecha límite de caducidad: {selectedModel.caducityDate}</div>
                                    <div>Total disponible: {selectedModel.totalQuantityAvailable}</div>
                                    <div>Total recibido: {selectedModel.totalQuantityReceived}</div>
                                    <div>Total entregado: {selectedModel.totalQuantityDelivered}</div>
                                    <div>
                                        Estado: {selectedModel.status ? 'HABILITADO' : 'DESHABILITADO'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                    <h2 className="text-2xl">Modelo encontrado</h2>
                    {JSON.stringify(selectedModel!, null, 2)}

                </div>
            }>

        </TitleContainer>
    )
}
