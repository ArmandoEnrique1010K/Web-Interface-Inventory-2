import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { ReturnDeliveryLineModal } from "./return/ReturnDeliveryLineModal";
type Props = {
    deliveryLineId: number;
    deliveryOrderId: number;
};

export const ReturnDeliveryLineButton = ({
    deliveryLineId,
    deliveryOrderId,
}: Props) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                type="button"
                size="small"
                text="Devolver"
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
                    title={`Devolver cantidad de la linea #${deliveryLineId}`}
                    locked
                >
                    <ReturnDeliveryLineModal
                        setShowModal={setShowModal}
                        deliveryLineId={deliveryLineId}
                        deliveryOrderId={deliveryOrderId!}
                    />
                </Modal>
            )}
        </>
    );
};
