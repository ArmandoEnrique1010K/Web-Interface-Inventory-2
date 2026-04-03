import { useQuery } from "@tanstack/react-query";
import { getStockLot } from "../../../api/StockLotAPI";
import { TextMessage } from "@/components/TextMessage";
import { TransferStockLotModal } from "./TransferStockLotModal";
import { BlueLoader } from "@/components/BlueLoader/BlueLoader";

type Props = {
    stockLotId: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoaderTransferStockLot = ({ stockLotId, setShowModal }: Props) => {
    const stockLotEmitterId = stockLotId;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["stocklot", stockLotEmitterId],
        queryFn: () => getStockLot(stockLotEmitterId),
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
        <TransferStockLotModal
            data={data}
            stockLotEmitterId={stockLotEmitterId}
            setShowModal={setShowModal}
        />
    );
};
