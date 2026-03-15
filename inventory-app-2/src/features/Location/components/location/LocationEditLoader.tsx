import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { TextMessage } from "@/components/TextMessage";
import { getLocation } from "../../api/LocationAPI";
import { LocationEditForm } from "./LocationEditForm";
import type { LocationItem } from "../../types";

export const LocationEditLoader = () => {
    const params = useParams();
    const locationId = params.id!;

    const { data, isLoading, isError } = useQuery<LocationItem>({
        queryKey: ['edit-location', locationId],
        queryFn: () => getLocation(locationId),
        retry: false,
    })


    if (isLoading) {
        return <TextMessage text='Cargando...' align='left' color='black' />
    }

    if (isError) {
        return <TextMessage text='Ha ocurrido un error' align='left' color='red' />
    }

    if (data) return (
        <LocationEditForm data={data} locationId={locationId} />
    )
}
