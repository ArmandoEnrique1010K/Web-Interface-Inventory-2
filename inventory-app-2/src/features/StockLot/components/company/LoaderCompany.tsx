import { useQuery } from "@tanstack/react-query";
import { TextMessage } from "@/components/TextMessage";
import { getCompany } from "../../api/CompanyAPI";
import { EditCompanyModal } from "./EditCompanyModal";

type Props = {
    companyId: string,
    showModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoaderCompany = ({ companyId, showModal }: Props) => {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['company', companyId],
        queryFn: () => getCompany(companyId),
        retry: false,
    })


    if (isLoading) {
        return <TextMessage text='Cargando...' align='left' color='black' />
    }

    if (isError) {
        return <TextMessage text='Ha ocurrido un error' align='left' color='red' />
    }

    if (data) return (
        <EditCompanyModal data={data} companyId={companyId} showModal={showModal} />
    )
}
