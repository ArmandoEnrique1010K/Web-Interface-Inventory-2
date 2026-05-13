import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../../api/CategoryAPI";
import { EditCategoryModal } from "./EditCategoryModal";
import { BlueLoader } from "@/components/BlueLoader/BlueLoader";
import { TextMessage } from "../../../../../components/TextMessage";

type Props = {
    categoryId: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoaderCategory = ({ categoryId, setShowModal }: Props) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["category", categoryId],
        queryFn: () => getCategory(categoryId),
        retry: 1,
    });

    if (isLoading) {
        return <BlueLoader />;
    }

    // FALLO EN LA API REST
    if (isError) {
        return (
            <TextMessage
                align="center"
                color="red"
                text="Ha ocurrido un error"
            />
        );
    }

    // AUSENCIA DE DATOS
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
        <EditCategoryModal
            data={data}
            categoryId={categoryId}
            setShowModal={setShowModal}
        />
    );
};
