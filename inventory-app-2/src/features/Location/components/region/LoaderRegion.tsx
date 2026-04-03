import { useQuery } from "@tanstack/react-query";
import { TextMessage } from "@/components/TextMessage";
import { getRegion } from "../../api/RegionAPI";
import { EditRegionModal } from "./EditRegionModal";
import { BlueLoader } from "@/components/BlueLoader/BlueLoader";

type Props = {
    regionId: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoaderRegion = ({ regionId, setShowModal }: Props) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["edit-region", regionId],
        queryFn: () => getRegion(regionId),
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
        <EditRegionModal
            data={data}
            regionId={regionId}
            setShowModal={setShowModal}
        />
    );
};
