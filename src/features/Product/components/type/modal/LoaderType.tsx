import { useQuery } from "@tanstack/react-query";
import { getType } from "../../../api/TypeAPI";
import { EditTypeModal } from "./EditTypeModal";
import { BlueLoader } from "@/components/BlueLoader/BlueLoader";
import { TextMessage } from "@/components/TextMessage";

type Props = {
    typeId: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoaderType = ({ typeId, setShowModal }: Props) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["type", typeId],
        queryFn: () => getType(typeId),
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
        <EditTypeModal
            data={data}
            typeId={typeId}
            setShowModal={setShowModal}
        />
    );
};
