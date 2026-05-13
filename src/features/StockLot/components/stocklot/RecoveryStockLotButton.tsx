import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { RecoveryStockLotModal } from "./recovery/RecoveryStockLotModal";

type Props = {
    stockLotId: number;
};

export const RecoveryStockLotButton = ({ stockLotId }: Props) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                type="button"
                size="small"
                text="Recuperar"
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
                    title={`Recuperar cantidad del lote de stock #${stockLotId}`}
                    locked
                >
                    <RecoveryStockLotModal
                        stockLotId={stockLotId}
                        setShowModal={setShowModal}
                    />
                </Modal>
            )}
        </>
    );
};
