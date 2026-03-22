import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../../api/ProductAPI";
import { TextMessage } from "@/components/TextMessage";
import { Error } from "@/views/Error";
import { EditProductModal } from "./EditProductModal";

type Props = {
    productId: string,
    modelId?: number
    closeModal: React.Dispatch<React.SetStateAction<boolean>>
}
export const LoaderProduct = ({ productId, closeModal, modelId }: Props) => {
    // const params = useParams();
    // const productId = params.id!;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['product', productId],
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
        <EditProductModal data={data} productId={productId} modelId={modelId} closeModal={closeModal} />
    )
}
