import { useQuery } from "@tanstack/react-query";
import { TextMessage } from "@/components/TextMessage";
import { getSubregion } from "../../api/SubregionAPI";
import { EditSubregionModal } from "./EditSubregionModal";

type Props = {
    subregionId: string,
    showModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoaderSubregion = ({ subregionId, showModal }: Props) => {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['subregion', subregionId],
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
        <EditSubregionModal data={data} subregionId={subregionId} showModal={showModal} />
    )
}
