import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { AddDeliveryLineModal } from "./add/AddDeliveryLineModal";

type Props = {
    deliveryOrderId: number;
};

export const AddDeliveryLineButton = ({ deliveryOrderId }: Props) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                type={"submit"}
                color={"blue"}
                text="Nueva linea"
                icon={<PlusCircleIcon />}
                onClick={() => setShowModal(true)}
                showTextOnMobile
            ></Button>
            {showModal && (
                <Modal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                    }}
                    size="lg"
                    title={`Agregar nueva linea de entrega a la orden de entrega #${deliveryOrderId}`}
                    locked
                >
                    <AddDeliveryLineModal
                        setShowModal={setShowModal}
                        deliveryOrderId={deliveryOrderId}
                    />
                </Modal>
            )}
        </>
    );
};
