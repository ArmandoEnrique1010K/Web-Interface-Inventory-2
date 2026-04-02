import { useQuery } from "@tanstack/react-query";
import { getType } from "../../api/TypeAPI";
import { TextMessage } from "@/components/TextMessage";
import { EditTypeModal } from "./modal/EditTypeModal";
import { BlueLoader } from "@/components/BlueLoader/BlueLoader";

type Props = {
    typeId: number,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoaderType = ({ typeId, setModalOpen }: Props) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['type', typeId],
        queryFn: () => getType(typeId),
        retry: 1,
    })

    if (isLoading) {
        return <BlueLoader />
    }

    if (isError) {
        return <TextMessage
            text='Ha ocurrido un error'
            align='center'
            color='red'
        />
    }

    if (data) return (
        <EditTypeModal data={data} typeId={typeId} setModalOpen={setModalOpen} />
    )
}
