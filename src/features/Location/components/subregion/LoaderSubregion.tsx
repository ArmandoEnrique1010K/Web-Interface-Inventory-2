import { useQuery } from "@tanstack/react-query";
import { TextMessage } from "@/components/TextMessage";
import { getSubregion } from "../../api/SubregionAPI";
import { EditSubregionModal } from "./EditSubregionModal";
import { BlueLoader } from "@/components/BlueLoader/BlueLoader";

type Props = {
    subregionId: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoaderSubregion = ({ subregionId, setShowModal }: Props) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["subregion", subregionId],
        queryFn: () => getSubregion(subregionId),
        retry: false,
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
        <EditSubregionModal
            data={data}
            subregionId={subregionId}
            setShowModal={setShowModal}
        />
    );
};
