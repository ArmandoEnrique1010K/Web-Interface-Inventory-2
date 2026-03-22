import { useQuery } from "@tanstack/react-query";
import { TextMessage } from "@/components/TextMessage";
import { Error } from "@/views/Error";
import { EditModelModal } from "./EditModelModal";
import { getModel } from "../../api/ModelAPI";

type Props = {
    modelId: number
    setEditCurrentModelModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoaderModel = ({ modelId, setEditCurrentModelModalOpen }: Props) => {
    // const params = useParams();
    // const modelId = params.modelId!;
    // const productId = params.productId!;


    const { data, isLoading, isError } = useQuery({
        queryKey: ['model', +modelId],
        queryFn: () => getModel(modelId.toString()),
        retry: false,
    })


    if (isLoading) {
        return <TextMessage text='Cargando...' align='left' color='black' />
    }

    if (isError) {
        return <Error />
    }

    if (data) return (
        <EditModelModal data={data} modelId={modelId.toString()} setEditCurrentModelModalOpen={setEditCurrentModelModalOpen} />
    )
}
