import { useQuery } from "@tanstack/react-query"
import { getProduct } from "../../api/ProductAPI"
import { useParams } from "react-router-dom"
import { TitleContainer } from "@/components/TitleContainer"
import type { ProductItem } from "../../types"
import { listAllModelsByProductId } from "../../api/ModelAPI"
import { ButtonLink } from "@/ui/ButtonLink"

export const ProductDetails = () => {

    const { id } = useParams()
    const { data: productData, isLoading } = useQuery<ProductItem>({
        queryKey: ['product-details'],
        queryFn: () => getProduct(id!)
    })

    const { data: modelsData } = useQuery({
        queryKey: ['models'],
        queryFn: () => listAllModelsByProductId(id!)
    })

    const models = modelsData!;

    if (isLoading) {
        return <div>Cargando...</div>
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
                    <ButtonLink size="large" to={`/products/status/${id}`} color="red" text={productData!.status ? 'Desactivar' : 'Activar'} />
                </>
            }
            children={
                <div className="flex flex-col gap-5">
                    <div>
                        <h2 className="text-2xl font-bold">Características</h2>
                        <div className="w-full">
                            <div>Categoria: {productData!.categoryName}</div>
                            <div>Tipo: {productData!.typeName}</div>
                        </div>
                    </div>

                    <div>
                        <div>Longitud: {productData!.length}</div>
                        <div>Ancho: {productData!.width}</div>
                        <div>Alto: {productData!.height}</div>


                        <div>Cantidad de modelos: {productData!.quantityModels}</div>
                        <h2 className="text-2xl">Modelo encontrado</h2>
                        {JSON.stringify(models?.[0], null, 2)}
                    </div>
                </div>
            }>

        </TitleContainer>
    )
}
