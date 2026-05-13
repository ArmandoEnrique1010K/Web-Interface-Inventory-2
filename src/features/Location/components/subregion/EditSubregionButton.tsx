import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { LoaderSubregion } from "./LoaderSubregion";

type Props = {
    subregionId: number;
};

export const EditSubregionButton = ({ subregionId }: Props) => {
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

            {subregionId && (
                <Modal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                    }}
                    size="lg"
                    title={`Editar subregión #${subregionId}`}
                    locked
                >
                    <LoaderSubregion
                        subregionId={subregionId}
                        setShowModal={setShowModal}
                    />
                </Modal>
            )}
        </>
    );
};
