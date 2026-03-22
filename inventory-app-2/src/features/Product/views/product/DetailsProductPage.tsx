import { useQuery } from "@tanstack/react-query"
import { getProduct } from "../../api/ProductAPI"
import { useLocation, useParams } from "react-router-dom"
import type { ModelDetailsItem, ProductItem } from "../../types"
import { listAllModelsByProductId } from "../../api/ModelAPI"
import { generateSizes } from "@/utils/generateSizes"
import { Button } from "@/ui/Button"
import { useSearchParams } from "react-router-dom"
import type { ModelItem } from '../../types/index';
import { useState } from "react"
import { PanelContainer } from "@/components/containers/PanelContainer"
import { LeftPanelContainer } from "@/components/LeftPanelContainer"
import { TableContainer } from "@/components/TableContainer"
import { TableRowContainer } from "@/components/TableRowContainer"
import { BaseTableCell } from "@/components/BaseTableCell"
import { SummaryPanelContainer } from "@/components/SummaryPanelContainer"
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout"
import { StatusProductButton } from "../../components/product/StatusProductButton"
import { QRModal } from "../../components/QRModal"
import { StatusModelButton } from "../../components/model/StatusModelButton"
import { Modal } from "@/components/Modal"
import { NewModelProductModal } from "../../components/product/NewModelProductModal"
import { LoaderProduct } from "../../components/product/LoaderProduct"
import { LoaderModel } from "../../components/model/LoaderModel"

export const DetailsProductPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const modelIdParam = searchParams.get("modelId")

    const [addModelModalOpen, setAddModelModalOpen] = useState(false);
    const [editCurrentModelModalOpen, setEditCurrentModelModalOpen] = useState(false);

    const [isQRModalOpen, setIsQRModalOpen] = useState(false)
    const handleOpenQR = () => {
        setIsQRModalOpen(true)
    }

    const location = useLocation();
    const path = location.pathname;
    const queryParams = location.search;


    const [editModalOpen, setEditModalOpen] = useState(false);

    const { id: productId } = useParams()
    const { data: productData, isLoading: isProductLoading } = useQuery<ProductItem>({
        queryKey: ['product', productId],
        queryFn: () => getProduct(productId!),
        // Si el id existe, ejecuta la función getProduct, de lo contrario no lo va a ejecutar
        enabled: !!productId
    })

    const { data: modelsData = [], isLoading: isModelsLoading, isError: isModelsError } = useQuery<ModelDetailsItem[]>({
        queryKey: ['models', 'product', productId],
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


    const hasNext = idModel > 0
    const hasPrevious = idModel < modelsData.length - 1
    const displayIndex = modelsData.length - idModel

    const handleNext = () => {

        if (idModel > 0) {
            const prevModel = modelsData[idModel - 1]
            setSearchParams({ modelId: String(prevModel.id) })
        }

    }

    const handlePrevious = () => {
        if (idModel < modelsData.length - 1) {
            const nextModel = modelsData[idModel + 1]
            setSearchParams({ modelId: String(nextModel.id) })


        }

    }


    if (isProductLoading || isModelsLoading) {
        return <div>Cargando...</div>
    }

    if (!productData) {
        return <div>Producto no encontrado o desactivado</div>
    }

    // TODO: INVESTIGAR QUE HACER CON UN PRODUCTO QUE ESTE CON UN ESTADO INACTIVO
    // TODO: CORREGIR LA API REST, SI UN PRODUCTO ESTA DESACTIVADO, TODAVIA PUEDE SER EDITADO Y VISTO POR UN ADMINISTRADOR
    // TODO: SI UN PRODUCTO ESTA DESACTIVADO NO PODRA SER VISTO POR LOS USUARIOS
    return (
        <EntityDetailsLayout>
            <EntityDetailsLayout.Header
                title={productData.name}
            ></EntityDetailsLayout.Header>

            <EntityDetailsLayout.Content>

                <EntityDetailsLayout.Column>
                    <PanelContainer subtitle="Características del producto">
                        <PanelContainer.DetailsGrid>
                            <PanelContainer.Detail label="ID">
                                {productData.id}
                            </PanelContainer.Detail>

                            <PanelContainer.Detail label="Categoria">
                                {productData.categoryName}
                            </PanelContainer.Detail>

                            <PanelContainer.Detail label="Tipo">
                                {productData.typeName}
                            </PanelContainer.Detail>

                            <PanelContainer.Detail label="Medidas">
                                {generateSizes(productData)}
                            </PanelContainer.Detail>
                        </PanelContainer.DetailsGrid>

                        <LeftPanelContainer.Image
                            url={selectedModel.imageUrl}
                            name={selectedModel.name}
                            legend={`${productData.name}, ${selectedModel.name}`}
                        />

                        <PanelContainer.DetailsGrid>
                            <PanelContainer.Detail label="Editar producto">
                                {/* <ButtonLink
                                    size="small"
                                    to={`/products/edit/${productId}`}
                                    color="blue"
                                    text="Editar"
                                    showIconOnMobile={false}
                                    showTextOnMobile={true}
                                    isLargeOnMobile={false}
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
                                    editModalOpen && productId && <Modal
                                        isOpen={editModalOpen}
                                        onClose={() => {
                                            setEditModalOpen(false)
                                        }
                                        }
                                        size='lg'
                                        title={`Editar el producto #${productId}`}
                                    >

                                        <LoaderProduct modelId={idModel} productId={productId.toString()} closeModal={setEditModalOpen} />
                                    </Modal>
                                }


                            </PanelContainer.Detail>

                            <PanelContainer.Detail label="Estado del producto">
                                <StatusProductButton
                                    from='product-details'
                                    size="small"
                                    productId={productId!}
                                    value={productData.status ? 'Activo' : 'Inactivo'}
                                />

                            </PanelContainer.Detail>

                        </PanelContainer.DetailsGrid>
                    </PanelContainer>
                </EntityDetailsLayout.Column>

                <EntityDetailsLayout.Column>
                    <PanelContainer
                        subtitle={"Modelo seleccionado"}>

                        <PanelContainer.Actions>
                            <Button
                                text="◄"
                                type="button"
                                size="small"
                                color="blue"
                                onClick={handlePrevious}
                                disabled={!hasPrevious}
                                showTextOnMobile
                            />

                            <Button
                                text={`${displayIndex} de ${modelsData.length}`}
                                type="button"
                                color="none"
                                size="small"
                                disabled
                                showTextOnMobile
                            />

                            <Button
                                text="►"
                                type="button"
                                color="blue"
                                onClick={handleNext}
                                disabled={!hasNext}
                                size="small"
                                showTextOnMobile
                            />

                            <Button
                                type="button"
                                size="small"
                                color="green"
                                text="Añadir"
                                showIconOnMobile={false}
                                showTextOnMobile={true}
                                isLargeOnMobile={false}
                                onClick={() => {
                                    setAddModelModalOpen(true)
                                }}
                            />
                            {
                                addModelModalOpen && productId && <Modal
                                    isOpen={addModelModalOpen}
                                    onClose={() => {
                                        setAddModelModalOpen(false)
                                    }
                                    }
                                    size='lg'
                                    title={`Añadir nuevo modelo al producto #${productId}`}
                                >
                                    <NewModelProductModal setAddModelModalOpen={setAddModelModalOpen} productId={productId} />
                                </Modal>

                            }
                        </PanelContainer.Actions>

                        <PanelContainer.DetailsGrid>
                            <PanelContainer.Detail label="ID">
                                {selectedModel.id}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Nombre">
                                {selectedModel.name}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Fecha de entrada">
                                {selectedModel.entryDate}
                            </PanelContainer.Detail>

                            {selectedModel.caducityDate && (
                                <PanelContainer.Detail label="Fecha de caducidad">
                                    {selectedModel.caducityDate}
                                </PanelContainer.Detail>
                            )}

                            <PanelContainer.Detail label="Cantidad diponible">
                                {selectedModel.totalQuantityAvailable}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Cantidad recibida">
                                {selectedModel.totalQuantityReceived}
                            </PanelContainer.Detail>
                            <PanelContainer.Detail label="Cantidad entregada">
                                {selectedModel.totalQuantityDelivered}
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
                                    url={import.meta.env.VITE_FRONTEND_DOMAIN + path + queryParams}
                                    title={`Código QR del producto ${productData?.name}, ${selectedModel?.name}`}
                                />
                            </PanelContainer.Detail>


                            {selectedModel.status && (
                                <PanelContainer.Detail label="Editar modelo">
                                    <Button
                                        text="Editar"
                                        type="button"
                                        color="blue"
                                        size="small"
                                        onClick={() => setEditCurrentModelModalOpen(true)}
                                    />


                                    {
                                        editCurrentModelModalOpen && productId && <Modal
                                            isOpen={editCurrentModelModalOpen}
                                            onClose={() => {
                                                setEditCurrentModelModalOpen(false)
                                            }
                                            }
                                            size='lg'
                                            title={`Editar modelo #${selectedModel.id}`}
                                        >
                                            <LoaderModel modelId={selectedModel.id} setEditCurrentModelModalOpen={setEditCurrentModelModalOpen} />
                                        </Modal>

                                    }

                                </PanelContainer.Detail>
                            )}

                            <PanelContainer.Detail label="Estado del modelo" isButton>
                                <StatusModelButton
                                    modelId={selectedModel.id.toString()}
                                    productId={productId!}
                                    value={selectedModel.status ? 'Activo' : 'Inactivo'}
                                    size={"small"} />
                            </PanelContainer.Detail>


                        </PanelContainer.DetailsGrid>

                    </PanelContainer>
                </EntityDetailsLayout.Column>

            </EntityDetailsLayout.Content>

            <EntityDetailsLayout.Summary>
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
            </EntityDetailsLayout.Summary>

        </EntityDetailsLayout>
    )
}
