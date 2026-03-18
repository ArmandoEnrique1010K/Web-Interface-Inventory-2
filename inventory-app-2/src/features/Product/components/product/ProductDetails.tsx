import { useQuery } from "@tanstack/react-query"
import { getProduct } from "../../api/ProductAPI"
import { useLocation, useParams } from "react-router-dom"
import type { ModelDetailsItem, ProductItem } from "../../types"
import { listAllModelsByProductId } from "../../api/ModelAPI"
import { ButtonLink } from "@/ui/ButtonLink"
import { generateSizes } from "@/utils/generateSizes"
import { Button } from "@/ui/Button"
import { useSearchParams } from "react-router-dom"
import type { ModelItem } from '../../types/index';
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline"
import { ProductChangeStatus } from "./ProductChangeStatus"
import { useState } from "react"
import { QRModal } from "../QRModal"
import { ModelChangeStatus } from "../model/ModelChangeStatus"
import { ElementContainer } from "@/views/ElementContainer"
import { RightPanelContainer } from "@/components/RightPanelContainer"
import { LeftPanelContainer } from "@/components/LeftPanelContainer"
import { TableContainer } from "@/components/TableContainer"
import { TableRowContainer } from "@/components/TableRowContainer"
import { BaseTableCell } from "@/components/BaseTableCell"
import { SummaryPanelContainer } from "@/components/SummaryPanelContainer"

export const ProductDetails = () => {
    // const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' })
    // const isMediumScreen = useMediaQuery({ query: '(min-width: 850px)' })
    // const isSmallScreen = useMediaQuery({ query: '(min-width: 900px)' })

    const [searchParams, setSearchParams] = useSearchParams()
    const modelIdParam = searchParams.get("modelId")

    const [isQRModalOpen, setIsQRModalOpen] = useState(false)
    const handleOpenQR = () => {
        setIsQRModalOpen(true)
    }

    const location = useLocation();
    const path = location.pathname;
    const queryParams = location.search;



    const { id: productId } = useParams()
    const { data: productData, isLoading: isProductLoading } = useQuery<ProductItem>({
        queryKey: ['product-details', productId],
        queryFn: () => getProduct(productId!),
        // Si el id existe, ejecuta la función getProduct, de lo contrario no lo va a ejecutar
        enabled: !!productId
    })

    const { data: modelsData = [], isLoading: isModelsLoading, isError: isModelsError } = useQuery<ModelDetailsItem[]>({
        queryKey: ['models-in-product', productId],
        queryFn: () => listAllModelsByProductId(productId!),
        enabled: !!productId
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


    // TODO: PROBAR SI LA IMAGEN SE ADAPTA AL ANCHO, DE LO CONTRARIO HABILITAR ESTA FUNCIÓN
    // Función para ajustar el tamaño de la imagen de acuerdo al ancho de pantalla
    // const handleChangeSizeImage = () => {
    //     if (isLargeScreen) {
    //         return 'size-100'
    //     } else if (isMediumScreen) {
    //         return 'size-80'
    //     } else if (isSmallScreen) {
    //         return 'size-64'
    //     } else {
    //         return 'size-52'
    //     }
    // }

    if (isProductLoading || isModelsLoading) {
        return <div>Cargando...</div>
    }

    if (!productData) {
        return <div>Producto no encontrado o desactivado</div>
    }


    // TODO: CORREGIR LA API REST, SI UN PRODUCTO ESTA DESACTIVADO, TODAVIA PUEDE SER EDITADO Y VISTO POR UN ADMINISTRADOR
    // TODO: SI UN PRODUCTO ESTA DESACTIVADO NO PODRA SER VISTO POR LOS USUARIOS
    return (
        <ElementContainer
            title={productData.name}
            buttonsContainer={
                <>
                    <ButtonLink icon={<PlusCircleIcon />} size="large" to={`/products/${productId}/models/new`} color="green" text="Añadir modelo" />
                    <ButtonLink icon={<PencilSquareIcon />} size="large" to={`/products/edit/${productId}`} color="blue" text="Editar producto" />
                    <ProductChangeStatus from='product-details' size="large" productId={productId!} value={productData!.status ? 'Desactivar producto' : 'Activar producto'} />
                </>
            }
            leftPanelContainer={
                <LeftPanelContainer subtitle="Características del producto">

                    <LeftPanelContainer.DetailsGroup>
                        <LeftPanelContainer.Detail label="ID">
                            {productData.id}
                        </LeftPanelContainer.Detail>

                        <LeftPanelContainer.Detail label="Categoria">
                            {productData.categoryName}
                        </LeftPanelContainer.Detail>

                        <LeftPanelContainer.Detail label="Tipo">
                            {productData.typeName}
                        </LeftPanelContainer.Detail>

                        <LeftPanelContainer.Detail label="Medidas">
                            {generateSizes(productData)}
                        </LeftPanelContainer.Detail>
                    </LeftPanelContainer.DetailsGroup>

                    <LeftPanelContainer.Image
                        url={selectedModel.imageUrl}
                        name={selectedModel.name}
                        legend={`${productData.name}, ${selectedModel.name}`}
                    />

                </LeftPanelContainer>
            }
            rightPanelContainer={
                <RightPanelContainer
                    subtitle={"Modelo seleccionado"}>

                    <RightPanelContainer.Actions>
                        <>
                            <Button
                                text="◄"
                                type="button"
                                color="blue"
                                onClick={handlePrevious}
                                disabled={!hasPrevious}
                                size="small"
                            />

                            <Button
                                text={`${modelsData.length ? idModel + 1 : 0} de ${modelsData.length}`}
                                type="button"
                                color="none"
                                size="small"
                                disabled
                            />

                            <Button
                                text="►"
                                type="button"
                                size="small"
                                color="blue"
                                onClick={handleNext}
                                disabled={!hasNext}
                            />
                        </>
                    </RightPanelContainer.Actions>

                    <RightPanelContainer.DetailsGrid>
                        <RightPanelContainer.Detail label="ID">
                            {selectedModel.id}
                        </RightPanelContainer.Detail>
                        <RightPanelContainer.Detail label="Nombre">
                            {selectedModel.name}
                        </RightPanelContainer.Detail>
                        <RightPanelContainer.Detail label="Fecha de entrada">
                            {selectedModel.entryDate}
                        </RightPanelContainer.Detail>

                        {selectedModel.caducityDate && (
                            <RightPanelContainer.Detail label="Fecha de caducidad">
                                {selectedModel.caducityDate}
                            </RightPanelContainer.Detail>
                        )}

                        <RightPanelContainer.Detail label="Cantidad diponible">
                            {selectedModel.totalQuantityAvailable}
                        </RightPanelContainer.Detail>
                        <RightPanelContainer.Detail label="Cantidad recibida">
                            {selectedModel.totalQuantityReceived}
                        </RightPanelContainer.Detail>
                        <RightPanelContainer.Detail label="Cantidad entregada">
                            {selectedModel.totalQuantityDelivered}
                        </RightPanelContainer.Detail>

                        <RightPanelContainer.Detail label="Estado del modelo" isButton>
                            <ModelChangeStatus
                                modelId={selectedModel.id.toString()}
                                productId={productId!}
                                value={selectedModel.status ? 'Activo' : 'Inactivo'}
                                size={"small"} />
                        </RightPanelContainer.Detail>

                        <RightPanelContainer.Detail label="Codigo QR">
                            <>
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
                                    url={import.meta.env.VITE_FRONTEND_DOMAIN + path + queryParams}
                                    title={`Código QR del producto ${productData?.name}, ${selectedModel?.name}`}
                                />
                            </>
                        </RightPanelContainer.Detail>

                        {selectedModel.status && (
                            <RightPanelContainer.Detail label="Editar modelo">
                                <ButtonLink
                                    size="small"
                                    text="Editar"
                                    to={`/products/${productId}/models/edit/${selectedModel.id}`}
                                    color="blue"
                                />
                            </RightPanelContainer.Detail>
                        )}
                    </RightPanelContainer.DetailsGrid>

                </RightPanelContainer>
            }
            summaryPanelContainer={
                <SummaryPanelContainer>
                    <TableContainer
                        title="Resumen de modelos"
                        headers={['ID', 'Nombre', 'Fecha de entrada', 'Total disponible']}
                        isError={isModelsError}
                        isEmpty={!modelsData?.length}
                    >
                        {modelsData?.map((model: ModelItem) => (
                            <TableRowContainer key={model.id}>
                                <BaseTableCell data={model.id} />
                                <BaseTableCell data={model.name} />
                                <BaseTableCell data={model.entryDate} />
                                <BaseTableCell data={model.totalQuantityAvailable} />
                            </TableRowContainer>
                        ))}


                    </TableContainer>
                </SummaryPanelContainer>
            }
        />


        // <ListElementsContainer
        //     title={productData!.name}
        //     buttonsContainer={
        //         <>
        //             <ButtonLink icon={<PlusCircleIcon />} size="large" to={`/products/${productId}/models/new`} color="green" text="Añadir modelo" />
        //             <ButtonLink icon={<PencilSquareIcon />} size="large" to={`/products/edit/${productId}`} color="blue" text="Editar producto" />
        //             <ProductChangeStatus from='product-details' size="large" productId={productId!} value={productData!.status ? 'Desactivar producto' : 'Activar producto'} />
        //         </>
        //     }
        //     dataContainer={
        //         <>
        //             <div className="flex flex-col justify-center items-center">
        //                 <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-8 gap-6 w-full">

        //                     {/* Características */}
        //                     <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4 lg:col-span-5">
        //                         <h2 className="text-3xl font-bold">Características del producto</h2>
        //                         <div className="space-y-1">
        //                             <div><span className="font-semibold">ID:</span> {productData!.id}</div>
        //                             <div><span className="font-semibold">Categoría:</span> {productData!.categoryName}</div>
        //                             <div><span className="font-semibold">Tipo:</span> {productData!.typeName}</div>
        //                         </div>
        //                         <div className="flex flex-col items-center gap-3">
        //                             {/* El tamaño de la imagen es variable */}
        //                             <div className={`w-full h-auto object-contain bg-gray-50 rounded-xl border flex items-center justify-center overflow-hidden`}>
        //                                 {selectedModel?.imageUrl
        //                                     ? (
        //                                         <img
        //                                             src={selectedModel.imageUrl}
        //                                             alt={selectedModel.name}
        //                                             className="max-h-full max-w-full object-contain"
        //                                         />
        //                                     )
        //                                     : <span className="text-gray-400 text-sm">Sin imagen</span>
        //                                 }
        //                             </div>

        //                             <div className="text-sm text-center">
        //                                 <span className="font-semibold">Medidas:</span> {generateSizes(productData!)}
        //                             </div>
        //                         </div>
        //                     </div>


        //                     {/* Modelo seleccionado */}
        //                     <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4 lg:col-span-3">
        //                         <h2 className="text-3xl font-bold">Modelo seleccionado</h2>
        //                         {/* Navegación modelos */}
        //                         <div className="flex items-center justify-center gap-3">
        //                             <Button
        //                                 text="◄"
        //                                 type="button"
        //                                 color="blue"
        //                                 onClick={handlePrevious}
        //                                 disabled={!hasPrevious}
        //                                 size="small"
        //                             />

        //                             <Button
        //                                 text={`${modelsData.length ? idModel + 1 : 0} de ${modelsData.length}`}
        //                                 type="button"
        //                                 color="none"
        //                                 size="small"
        //                                 disabled
        //                             />

        //                             <Button
        //                                 text="►"
        //                                 type="button"
        //                                 size="small"
        //                                 color="blue"
        //                                 onClick={handleNext}
        //                                 disabled={!hasNext}
        //                             />
        //                         </div>
        //                         {selectedModel && (
        //                             <div className="grid grid-cols-2 gap-y-2 text-sm mt-2">

        //                                 <div className="font-semibold">ID:</div>
        //                                 <div>{selectedModel.id}</div>

        //                                 <div className="font-semibold">Nombre:</div>
        //                                 <div>{selectedModel.name}</div>

        //                                 <div className="font-semibold">Fecha entrada:</div>
        //                                 <div>{selectedModel.entryDate}</div>

        //                                 {
        //                                     selectedModel.caducityDate &&
        //                                     <>
        //                                         <div className="font-semibold">Caducidad:</div>
        //                                         <div>{selectedModel.caducityDate}</div>
        //                                     </>
        //                                 }

        //                                 <div className="font-semibold">Cantidad disponible:</div>
        //                                 <div>{selectedModel.totalQuantityAvailable}</div>

        //                                 <div className="font-semibold">Cantidad recibida:</div>
        //                                 <div>{selectedModel.totalQuantityReceived}</div>

        //                                 <div className="font-semibold">Cantidad entregada:</div>
        //                                 <div>{selectedModel.totalQuantityDelivered}</div>

        //                                 <div className="font-semibold">Estado del modelo:</div>
        //                                 <div className="flex justify-start">
        //                                     <ModelChangeStatus modelId={selectedModel.id} productId={productId!} value={selectedModel.status ? 'Activo' : 'Inactivo'} size={"small"} />
        //                                 </div>

        //                                 <div className="font-semibold">Código QR:</div>
        //                                 <div>
        //                                     {/* TODO: ESTE BOTON DEBE MOSTRAR EL CODIGO QR EN UNA VENTANA MODAL */}
        //                                     <Button
        //                                         text="Obtener QR"
        //                                         type="button"
        //                                         color="blue"
        //                                         size="small"
        //                                         onClick={handleOpenQR}
        //                                     />

        //                                     <QRModal
        //                                         isOpen={isQRModalOpen}
        //                                         onClose={() => setIsQRModalOpen(false)}
        //                                         // TODO: CORREGIR EL NOMBRE DEL DOMINIO EN UN FUTURO
        //                                         url={'http://localhost:5173' + path + queryParams}
        //                                         title={`Código QR del producto ${productData?.name}, ${selectedModel?.name}`}
        //                                     />

        //                                 </div>

        //                                 {
        //                                     selectedModel.status && <>
        //                                         <div className="font-semibold">Editar modelo:</div>

        //                                         <div>
        //                                             <ButtonLink
        //                                                 size="small"
        //                                                 text="Editar"
        //                                                 to={`/products/${productId}/models/edit/${selectedModel.id}`}
        //                                                 color="blue"
        //                                             />
        //                                         </div>

        //                                     </>
        //                                 }
        //                             </div>
        //                         )}
        //                     </div>

        //                 </div>
        //             </div>


        //             <h2 className="text-3xl font-bold pt-8 pb-2">Tabla resumen de modelos</h2>
        //             <TableContainer headers={['ID', 'Nombre', 'Fecha de entrada', 'Total disponible']} isError={isModelsError} isEmpty={!modelsData?.length}>
        //                 {modelsData?.map((model: ModelItem) => (
        //                     <TableRowContainer key={model.id}>
        //                         <BaseTableCell data={model.id} />
        //                         <BaseTableCell data={model.name} />
        //                         <BaseTableCell data={model.entryDate} />
        //                         <BaseTableCell data={model.totalQuantityAvailable} />
        //                     </TableRowContainer>
        //                 ))}
        //             </TableContainer>
        //         </>
        //     }>

        // </ListElementsContainer>
    )
}
