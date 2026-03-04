import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getProduct } from "../../api/ProductAPI";
import { TextMessage } from "@/components/TextMessage";
import { ProductEditForm } from "./ProductEditForm";
import { Error } from "@/views/Error";

export const ProductEditLoader = () => {
    const params = useParams();
    const productId = params.id!;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['edit-product', productId],
        queryFn: () => getProduct(productId),
        retry: false,
    })


    if (isLoading) {
        return <TextMessage text='Cargando...' align='left' color='black' />
    }

    if (isError) {
        return <Error />
    }

    if (data) return (
        <ProductEditForm data={data} productId={productId} />
    )
}
