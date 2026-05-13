import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../../../api/ProductAPI";
import { EditProductModal } from "./EditProductModal";
import { BlueLoader } from "@/components/BlueLoader/BlueLoader";
import { TextMessage } from "@/components/TextMessage";

type Props = {
    productId: number;
    modelId?: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};
export const LoaderProduct = ({ productId, setShowModal, modelId }: Props) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => getProduct(productId),
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
        <EditProductModal
            data={data}
            productId={productId}
            modelId={modelId}
            setShowModal={setShowModal}
        />
    );
};
