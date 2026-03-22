import { useQuery } from "@tanstack/react-query";
import { TextMessage } from "@/components/TextMessage";
import { getRegion } from "../../api/RegionAPI";
import { EditRegionModal } from "./EditRegionModal";

type Props = {
    regionId: string,
    showModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoaderRegion = ({ regionId, showModal }: Props) => {

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
        <EditRegionModal data={data} regionId={regionId} showModal={showModal} />
    )
}
