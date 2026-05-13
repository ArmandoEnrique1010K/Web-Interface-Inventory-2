import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { LoaderCompany } from "./edit/LoaderCompany";

type Props = {
    companyId: number;
};

export const EditCompanyButton = ({ companyId }: Props) => {
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
                    title={`Editar empresa importadora #${companyId}`}
                >
                    <LoaderCompany
                        companyId={companyId}
                        showModal={setShowModal}
                    />
                </Modal>
            )}
        </>
    );
};
