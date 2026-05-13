import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { LoaderModel } from "./modal/LoaderModel";

type Props = {
    modelId: number;
};

export const EditModelButton = ({ modelId }: Props) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                type="button"
                size="small"
                text="Editar"
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
                    title={`Editar modelo #${modelId}`}
                    locked
                >
                    <LoaderModel
                        modelId={modelId}
                        setShowModal={setShowModal}
                    />
                </Modal>
            )}
        </>
    );
};
