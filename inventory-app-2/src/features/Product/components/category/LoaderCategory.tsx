import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../api/CategoryAPI";
import { TextMessage } from "@/components/TextMessage";
import { EditCategoryModal } from "./modal/EditCategoryModal";
import { BlueLoader } from "@/components/BlueLoader/BlueLoader";

type Props = {
    categoryId: number,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export const LoaderCategory = ({ categoryId, setModalOpen }: Props) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['category', categoryId],
        queryFn: () => getCategory(categoryId),
        retry: 1, // reintentar el llamado 1 vez más, si falla
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
        <EditCategoryModal data={data} categoryId={categoryId} setModalOpen={setModalOpen} />
    )
}
