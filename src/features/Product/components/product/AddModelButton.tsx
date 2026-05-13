import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { NewModelProductModal } from "./modal/NewModelProductModal";

type Props = {
    productId: number;
};

export const AddModelButton = ({ productId }: Props) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                type="button"
                size="small"
                color="green"
                text="Añadir"
                showTextOnMobile
                onClick={() => {
                    setShowModal(true);
                }}
            />

            {showModal && (
                <Modal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                    }}
                    size="lg"
                    title={`Añadir nuevo modelo al producto #${productId}`}
                    locked
                >
                    <NewModelProductModal
                        setShowModal={setShowModal}
                        productId={productId}
                    />
                </Modal>
            )}
        </>
    );
};
