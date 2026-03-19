import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getCategory } from "../../api/CategoryAPI";
import { TextMessage } from "@/components/TextMessage";
import { EditCategoryPage } from "./EditCategoryPage";

export const LoaderCategoryPage = () => {
    const params = useParams();
    const categoryId = params.id!;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['edit-category', categoryId],
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
        <EditCategoryPage data={data} categoryId={categoryId} />
    )
}
