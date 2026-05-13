import { Modal } from "@/components/Modal";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { LoaderProduct } from "./modal/LoaderProduct";

type Props = {
    productId: number;
};

export const EditProductButton = ({ productId }: Props) => {
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
            {
                // Solamente debe renderizar la ventana modal cuando haya un producto seleccionado, de lo contrario no funcionara
                showModal && (
                    <Modal
                        isOpen={showModal}
                        onClose={() => {
                            setShowModal(false);
                        }}
                        size="lg"
                        title={`Editar producto #${productId}`}
                        locked
                    >
                        <LoaderProduct
                            productId={productId}
                            setShowModal={setShowModal}
                        />
                    </Modal>
                )
            }
        </>
    );
};
