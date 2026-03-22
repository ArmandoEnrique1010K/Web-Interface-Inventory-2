import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../api/CategoryAPI";
import { TextMessage } from "@/components/TextMessage";
import { EditCategoryModal } from "./EditCategoryModal";

type Props = {
    categoryId: string,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export const LoaderCategory = ({ categoryId, setModalOpen }: Props) => {
    // const params = useParams();
    // const categoryId = params.id!;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['category', categoryId],
        queryFn: () => getCategory(categoryId),
        retry: false,
    })


    if (isLoading) {
        return <TextMessage text='Cargando...' align='left' color='black' />
    }

    if (isError) {
        return <TextMessage text='Ha ocurrido un error' align='left' color='red' />
    }

    if (data) return (
        <EditCategoryModal data={data} categoryId={categoryId} setModalOpen={setModalOpen} />
    )
}
