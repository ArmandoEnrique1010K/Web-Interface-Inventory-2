import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getType } from "../../api/TypeAPI";
import { TypeEditForm } from "./TypeEditForm";
import { TextMessage } from "@/components/TextMessage";

export const TypeEditLoader = () => {
    const params = useParams();
    const typeId = params.id!;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['edit-type', typeId],
        queryFn: () => getType(typeId),
        retry: false,
    })


    if (isLoading) {
        return <TextMessage text='Cargando...' align='left' color='black' />
    }

    if (isError) {
        return <TextMessage text='Ha ocurrido un error' align='left' color='red' />
    }

    if (data) return (
        <TypeEditForm data={data} typeId={typeId} />
    )
}
