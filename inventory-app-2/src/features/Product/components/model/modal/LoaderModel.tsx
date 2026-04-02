import { useQuery } from "@tanstack/react-query";
import { EditModelModal } from "./EditModelModal";
import { getModel } from "../../../api/ModelAPI";
import type { ModelItem } from "@/features/Product/schemas/items";
import { BlueLoader } from "@/components/BlueLoader/BlueLoader";
import { TextMessage } from "@/components/TextMessage";

type Props = {
    modelId: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoaderModel = ({ modelId, setShowModal }: Props) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["model", +modelId],
        queryFn: () => getModel(modelId),
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

    if (data)
        return (
            <EditModelModal
                data={data as ModelItem & { file: File }}
                modelId={modelId.toString()}
                setShowModal={setShowModal}
            />
        );
};
