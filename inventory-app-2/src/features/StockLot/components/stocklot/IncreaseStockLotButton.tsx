import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { IncreaseStockLotModal } from "./increase/IncreaseStockLotModal";

type Props = {
    stockLotId: number;
};

export const IncreaseStockLotButton = ({ stockLotId }: Props) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                type="button"
                size="small"
                text="Agregar"
                color="green-outline"
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
                    title={`Agregar cantidad al lote de stock #${stockLotId}`}
                    locked
                >
                    <IncreaseStockLotModal
                        stockLotId={stockLotId}
                        setShowModal={setShowModal}
                    />
                </Modal>
            )}
        </>
    );
};
