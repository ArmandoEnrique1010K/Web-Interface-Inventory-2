import { Button } from "@/ui/Button";
import { useState } from "react";
import { QRModal } from "./QRModal";

type Props = {
    productName: string;
    modelName: string;
    path: string;
    queryParams?: string;
};

export const QRButton = ({
    productName,
    modelName,
    path,
    queryParams,
}: Props) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                text="Obtener QR"
                type="button"
                color="blue"
                size="small"
                onClick={() => {
                    setShowModal(true);
                }}
            />

            <QRModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                url={import.meta.env.VITE_FRONTEND_DOMAIN + path + queryParams}
                title={`Código QR del producto ${productName}, ${modelName}`}
            />
        </>
    );
};
