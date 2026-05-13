import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { LoaderRegion } from "./LoaderRegion";

type Props = {
    regionId: number;
};

export const EditRegionButton = ({ regionId }: Props) => {
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
                    title={`Editar region #${regionId}`}
                    locked
                >
                    <LoaderRegion
                        regionId={regionId}
                        setShowModal={setShowModal}
                    />
                </Modal>
            )}
        </>
    );
};
