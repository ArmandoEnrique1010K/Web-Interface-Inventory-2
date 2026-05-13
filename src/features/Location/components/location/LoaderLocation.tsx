import { useQuery } from "@tanstack/react-query";
import { TextMessage } from "@/components/TextMessage";
import { getLocation } from "../../api/LocationAPI";
import { EditLocationModal } from "./EditLocationModal";
import { BlueLoader } from "@/components/BlueLoader/BlueLoader";

type Props = {
    locationId: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoaderLocation = ({ locationId, setShowModal }: Props) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["location", locationId],
        queryFn: () => getLocation(locationId),
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
        <EditLocationModal
            data={data}
            locationId={locationId}
            setShowModal={setShowModal}
        />
    );
};
