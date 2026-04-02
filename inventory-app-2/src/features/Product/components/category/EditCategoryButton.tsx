import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { LoaderCategory } from "./modal/LoaderCategory";

type Props = {
    categoryId: number;
};

export const EditCategoryButton = ({ categoryId }: Props) => {
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
                    title={`Editar categoria #${categoryId}`}
                    locked
                >
                    <LoaderCategory
                        categoryId={categoryId}
                        setShowModal={setShowModal}
                    />
                </Modal>
            )}
        </>
    );
};
