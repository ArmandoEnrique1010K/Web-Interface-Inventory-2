import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { LoaderUser } from "./alterRoles/LoaderUser";

type Props = {
    userId: number;
};

export const AlterRolesUserButton = ({ userId }: Props) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                type="button"
                size="small"
                text="Alterar rol"
                color="red-outline"
                onClick={() => {
                    setShowModal(true);
                }}
                showTextOnMobile
            />

            {
                // Solamente debe renderizar la ventana modal cuando haya un producto seleccionado, de lo contrario no funcionara
                showModal && (
                    <Modal
                        isOpen={showModal}
                        onClose={() => {
                            setShowModal(false);
                        }}
                        size="lg"
                        title={`Alterar roles del usuario #${userId}`}
                        locked
                    >
                        <LoaderUser
                            userId={userId}
                            setShowModal={setShowModal}
                        />
                    </Modal>
                )
            }
        </>
    );
};
