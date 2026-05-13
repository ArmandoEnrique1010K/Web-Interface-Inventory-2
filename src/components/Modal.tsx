// src/components/ui/Modal.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useMediaQuery } from "react-responsive";
import { handleApplyStyleColor } from "@/utils/handleApplyStyleColor";
import { useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
    title: string;
    locked?: boolean; // Bloquea el cierre automatico de la ventana modal cuando el usuario hace clic fuera de ella
}

export const Modal = ({
    isOpen,
    onClose,
    children,
    size = "md",
    title,
    locked,
}: ModalProps) => {
    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

    //* IMPORTANTE, CADA VEZ QUE SE ABRE LA VENTANA MODAL, VEO QUE EN LA ETIQUETA <body> CAMBIA EL ATRIBUTO "style"
    // Esta podria ser la solución para habilitar el boton de cerrado de la notificacion con sonner,
    // Al cambiar la propiedad pointerEvents luego de 500 ms, se podra cerrar la notificacion
    useEffect(() => {
        setTimeout(() => {
            if (isOpen) {
                document.body.style.pointerEvents = "auto";
            } else {
                document.body.style.pointerEvents = "";
            }
        }, 500);
    }, [isOpen]);

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={(open) => {
                // Solamente cierra cuando la ventana modal no esta bloqueada y si el usuario la trata de cerrar haciendo clic fuera de ella
                if (!open) onClose();
            }}
        >
            <Dialog.Portal>
                <Dialog.Overlay
                    className="fixed inset-0 bg-black/50 
                    data-[state=open]:animate-in 
                data-[state=closed]:animate-out 
                data-[state=closed]:fade-out-0 
                data-[state=open]:fade-in-0"
                />
                <Dialog.Content
                    // Se ejecuta cuando el usuario hace clic fuera de la ventana modal
                    // Ignora el valor de locked
                    onPointerDownOutside={(e) => {
                        if (locked) e.preventDefault();
                    }}
                    onInteractOutside={(e) => {
                        if (locked) e.preventDefault();
                    }}
                    aria-disabled
                    // 👈 CLAVE
                    className={`fixed overflow-y-auto 
                    ${
                        isMobile
                            ? "inset-0 w-full h-full rounded-none flex flex-col p-4"
                            : `left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${sizeClasses[size]} max-h-[90vh] rounded-lg p-6`
                    }
                    bg-white shadow-lg  pointer-events-auto
                    `}
                >
                    {title && (
                        <Dialog.Title className="text-4xl font-semibold pb-6 mr-12">
                            {title}
                        </Dialog.Title>
                    )}
                    {
                        <Dialog.Description className="hidden">
                            Descripcion
                        </Dialog.Description>
                    }
                    <Dialog.Close
                        className={`${handleApplyStyleColor("red")} absolute 
                        ${isMobile ? "right-4 top-4" : "right-6 top-6"} 
                        border-none rounded-sm opacity-70 focus:ring-0 
                        focus:outline-none disabled:pointer-events-none`}
                    >
                        <XMarkIcon className="size-8 hover:cursor-pointer" />
                        <span className="sr-only">Close</span>
                    </Dialog.Close>
                    {children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
