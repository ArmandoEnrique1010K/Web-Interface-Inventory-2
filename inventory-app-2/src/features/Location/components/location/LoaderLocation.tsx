import { useQuery } from "@tanstack/react-query";
import { TextMessage } from "@/components/TextMessage";
import { getLocation } from "../../api/LocationAPI";
import { EditLocationModal } from "./EditLocationModal";
import type { LocationItem } from "../../types";


type Props = {
    locationId: string,
    showModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoaderLocation = ({ locationId, showModal }: Props) => {

    const { data, isLoading, isError } = useQuery<LocationItem>({
        queryKey: ['location', locationId],
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
        <EditLocationModal data={data} locationId={locationId} showModal={showModal} />
    )
}
