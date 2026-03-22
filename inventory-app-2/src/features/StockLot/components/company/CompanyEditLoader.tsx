import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { TextMessage } from "@/components/TextMessage";
import { getCompany } from "../../api/CompanyAPI";
import { CompanyEditForm } from "./CompanyEditForm";

export const CompanyEditLoader = () => {
    const params = useParams();
    const companyId = params.id!;

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
        <CompanyEditForm data={data} companyId={companyId} />
    )
}
