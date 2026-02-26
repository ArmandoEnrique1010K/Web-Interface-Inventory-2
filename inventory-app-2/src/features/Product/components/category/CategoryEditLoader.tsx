import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getCategory } from "../../api/CategoryAPI";
import { CategoryEditForm } from "./CategoryEditForm";

export const CategoryEditLoader = () => {
    const params = useParams();
    const categoryId = params.id!;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['edit-category', categoryId],
        queryFn: () => getCategory(categoryId),
        retry: false,
    })


    if (isLoading) {
        return <h1>Cargando...</h1>
    }

    if (isError) {
        return <h1>Error...</h1>
    }

    if (data) return (
        <CategoryEditForm data={data} categoryId={categoryId} />
    )
}
