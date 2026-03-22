import { useQuery } from "@tanstack/react-query";
import { getType } from "../../api/TypeAPI";
import { TextMessage } from "@/components/TextMessage";
import { EditTypeModal } from "./EditTypeModal";

type Props = {
    typeId: string,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoaderType = ({ typeId, setModalOpen }: Props) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['type', typeId],
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
        <EditTypeModal data={data} typeId={typeId} setModalOpen={setModalOpen} />
    )
}
