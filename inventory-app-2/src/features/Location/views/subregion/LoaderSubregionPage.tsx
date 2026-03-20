import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { TextMessage } from "@/components/TextMessage";
import { getSubregion } from "../../api/SubregionAPI";
import { EditSubregionPage } from "./EditSubregionPage";

export const LoaderSubregionPage = () => {
    const params = useParams();
    const subregionId = params.id!;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['edit-subregion', subregionId],
        queryFn: () => getSubregion(subregionId),
        retry: false,
    })


    if (isLoading) {
        return <TextMessage text='Cargando...' align='left' color='black' />
    }

    if (isError) {
        return <TextMessage text='Ha ocurrido un error' align='left' color='red' />
    }

    if (data) return (
        <EditSubregionPage data={data} subregionId={subregionId} />
    )
}
