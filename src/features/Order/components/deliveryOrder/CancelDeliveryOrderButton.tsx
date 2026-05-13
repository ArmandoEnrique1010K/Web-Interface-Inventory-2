import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { CancelDeliveryOrderModal } from "./cancel/CancelDeliveryOrderModal";
type Props = {
    deliveryOrderId: number;
};
export const CancelDeliveryOrderButton = ({ deliveryOrderId }: Props) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                type={"button"}
                color={"red-outline"}
                size="small"
                showTextOnMobile
                text="Cancelar"
                onClick={() => setShowModal(true)}
            />

            {showModal && (
                <Modal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                    }}
                    size="lg"
                    title={`Añada un comentario antes de cancelar la orden #${deliveryOrderId}`}
                    locked
                >
                    <CancelDeliveryOrderModal
                        setShowModal={setShowModal}
                        deliveryOrderId={deliveryOrderId}
                    />
                </Modal>
            )}
        </>
    );
};
