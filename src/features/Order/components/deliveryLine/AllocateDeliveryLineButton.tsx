import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { AllocateDeliveryLineModal } from "./allocate/AllocateDeliveryLineModal";

type Props = {
    deliveryLineId: number;
    deliveryOrderId: number;
    modelId: number;
};

export const AllocateDeliveryLineButton = ({
    deliveryLineId,
    deliveryOrderId,
    modelId,
}: Props) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                type="button"
                size="small"
                text="Distribuir"
                color="green-outline"
                onClick={() => {
                    setShowModal(true);
                }}
                showTextOnMobile
            />

            {
                // VENTANAS MODALES POR CADA UNA DE LAS OPERACIONES
                showModal && (
                    <Modal
                        isOpen={showModal}
                        onClose={() => {
                            setShowModal(false);
                        }}
                        size="lg"
                        title={`Distribuir cantidad desde los lotes de stock a la linea #${deliveryLineId}`}
                        locked
                    >
                        <AllocateDeliveryLineModal
                            setShowModal={setShowModal}
                            deliveryLineId={deliveryLineId}
                            deliveryOrderId={deliveryOrderId!}
                            modelId={modelId}
                        />
                    </Modal>
                )
            }
        </>
    );
};
