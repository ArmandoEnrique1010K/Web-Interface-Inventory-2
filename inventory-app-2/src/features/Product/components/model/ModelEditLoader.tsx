import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { TextMessage } from "@/components/TextMessage";
import { Error } from "@/views/Error";
import { ModelEditForm } from "./ModelEditForm";
import { getModel } from "../../api/ModelAPI";

export const ModelEditLoader = () => {
    const params = useParams();
    const modelId = params.modelId!;
    const productId = params.productId!;


    const { data, isLoading, isError } = useQuery({
        queryKey: ['edit-model', modelId],
        queryFn: () => getModel(modelId),
        retry: false,
    })


    if (isLoading) {
        return <TextMessage text='Cargando...' align='left' color='black' />
    }

    if (isError) {
        return <Error />
    }

    if (data) return (
        <ModelEditForm data={data} modelId={modelId} productId={productId} />
    )
}
