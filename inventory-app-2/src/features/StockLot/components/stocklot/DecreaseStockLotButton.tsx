import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { DecreaseStockLotModal } from "./decrease/DecreaseStockLotModal";

type Props = {
    stockLotId: number;
};

export const DecreaseStockLotButton = ({ stockLotId }: Props) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                type="button"
                size="small"
                text="Quitar"
                color="red-outline"
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
                    title={`Disminuir cantidad al lote de stock #${stockLotId}`}
                    locked
                >
                    <DecreaseStockLotModal
                        stockLotId={stockLotId}
                        setShowModal={setShowModal}
                    />
                </Modal>
            )}
        </>
    );
};
