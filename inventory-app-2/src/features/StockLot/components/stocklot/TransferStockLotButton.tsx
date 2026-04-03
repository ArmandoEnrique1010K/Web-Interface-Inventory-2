import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { LoaderTransferStockLot } from "./transfer/LoaderTransferStockLot";

type Props = {
    stockLotId: number;
};

export const TransferStockLotButton = ({ stockLotId }: Props) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                type="button"
                size="small"
                text="Transferir"
                color="blue-outline"
                onClick={() => {
                    setShowModal(true);
                }}
                showTextOnMobile
            />

            {showModal && (
                <Modal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                    }}
                    size="lg"
                    title={`Transferir cantidad desde el lote de stock #${stockLotId}`}
                    locked
                >
                    <LoaderTransferStockLot
                        stockLotId={stockLotId}
                        setShowModal={setShowModal}
                    />
                </Modal>
            )}
        </>
    );
};
