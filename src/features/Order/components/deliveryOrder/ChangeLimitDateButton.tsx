import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { ChangeLimitDateModal } from "./changeLimitDate/ChangeLimitDateModal";

type Props = {
    deliveryOrderId: number;
};
export const ChangeLimitDateButton = ({ deliveryOrderId }: Props) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                size="small"
                text="Cambiar fecha"
                color="blue-outline"
                type="button"
                showTextOnMobile
                onClick={() => setShowModal(true)}
            />

            {showModal && (
                <Modal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                    }}
                    size="lg"
                    title={`Cambiar la fecha limite de la orden de entrega #${deliveryOrderId}`}
                    locked
                >
                    <ChangeLimitDateModal
                        deliveryOrderId={deliveryOrderId}
                        setShowModal={setShowModal}
                    />
                </Modal>
            )}
        </>
    );
};
