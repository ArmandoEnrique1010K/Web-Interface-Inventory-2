import { useQuery } from "@tanstack/react-query";
import { TextMessage } from "@/components/TextMessage";
import { getCompany } from "../../../api/CompanyAPI";
import { EditCompanyModal } from "./EditCompanyModal";
import { BlueLoader } from "@/components/BlueLoader/BlueLoader";

type Props = {
    companyId: number;
    showModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoaderCompany = ({ companyId, showModal }: Props) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["company", companyId],
        queryFn: () => getCompany(companyId),
        retry: 1,
    });

    if (isLoading) {
        return <BlueLoader />;
    }

    if (isError) {
        return (
            <TextMessage
                align="center"
                color="red"
                text="Ha ocurrido un error"
            />
        );
    }

    if (!data) {
        return (
            <TextMessage
                align="center"
                color="red"
                text="No se ha encontrado el contenido"
            />
        );
    }

    return (
        <EditCompanyModal
            data={data}
            companyId={companyId}
            showModal={showModal}
        />
    );
};
