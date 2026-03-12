import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { TextMessage } from "@/components/TextMessage";
import { getRegion } from "../../api/RegionAPI";
import { RegionEditForm } from "./RegionEditForm";

export const RegionEditLoader = () => {
    const params = useParams();
    const regionId = params.id!;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['edit-region', regionId],
        queryFn: () => getRegion(regionId),
        retry: false,
    })


    if (isLoading) {
        return <TextMessage text='Cargando...' align='left' color='black' />
    }

    if (isError) {
        return <TextMessage text='Ha ocurrido un error' align='left' color='red' />
    }

    if (data) return (
        <RegionEditForm data={data} regionId={regionId} />
    )
}
