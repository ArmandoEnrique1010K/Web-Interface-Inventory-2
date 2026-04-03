import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { LoaderLocation } from "./LoaderLocation";

type Props = {
    locationId: number;
};

export const EditLocationButton = ({ locationId }: Props) => {
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
                    title={`Editar categoria #${locationId}`}
                    locked
                >
                    <LoaderLocation
                        locationId={locationId}
                        setShowModal={setShowModal}
                    />
                </Modal>
            )}
        </>
    );
};
