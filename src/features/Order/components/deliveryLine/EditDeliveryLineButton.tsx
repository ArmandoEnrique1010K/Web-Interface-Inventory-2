import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { EditDeliveryLineModal } from "./edit/EditDeliveryLineModal";

type Props = {
    deliveryLineId: number;
    deliveryOrderId: number;
    limitDate: string;
    requiredQuantity: number;
};

export const EditDeliveryLineButton = ({
    deliveryLineId,
    deliveryOrderId,
    limitDate,
    requiredQuantity,
}: Props) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                type="button"
                size="large"
                text="Editar linea"
                color="blue"
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
                    title={`Editar linea de entrega ${deliveryLineId}`}
                    locked
                >
                    <EditDeliveryLineModal
                        setShowModal={setShowModal}
                        deliveryLineId={deliveryLineId}
                        deliveryOrderId={deliveryOrderId!}
                        limitDate={limitDate}
                        requiredQuantity={requiredQuantity}
                    />
                </Modal>
            )}
        </>
    );
};
