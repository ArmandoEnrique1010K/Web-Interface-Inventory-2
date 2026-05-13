import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { LostDeliveryLineModal } from "./lost/LostDeliveryLineModal";

type Props = {
    deliveryLineId: number;
    deliveryOrderId: number;
};

export const LostDeliveryLineButton = ({
    deliveryLineId,
    deliveryOrderId,
}: Props) => {
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
                    title={`Quitar cantidad de la linea #${deliveryLineId}`}
                    locked
                >
                    <LostDeliveryLineModal
                        setShowModal={setShowModal}
                        deliveryLineId={deliveryLineId}
                        deliveryOrderId={deliveryOrderId!}
                    />
                </Modal>
            )}
        </>
    );
};
