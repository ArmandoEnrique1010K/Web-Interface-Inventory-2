// src/components/ui/Modal.tsx
import * as Dialog from '@radix-ui/react-dialog'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useMediaQuery } from 'react-responsive'
import { handleApplyStyleColor } from '@/utils/handleApplyStyleColor'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
    title: string
}

export const Modal = ({ isOpen, onClose, children, size = 'md', title }: ModalProps) => {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    }

    const isSmallScreen = useMediaQuery({ query: '(max-width: 480px)' })


    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content
                    // className={`
                    //     fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                    //     w-full ${sizeClasses[size]} 
                    //         max-h-[90vh] overflow-y-auto

                    //     rounded-lg bg-white pt-16  ${!isSmallScreen ? 'px-6 pb-8' : 'px-2 pb-3'} shadow-lg 
                    //     data-[state=open]:animate-in data-[state=closed]:animate-out 
                    //     data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 
                    //     data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 
                    //     data-[state=closed]:slide-out-to-left-1/2 
                    //     data-[state=closed]:slide-out-to-top-[48%] 
                    //     data-[state=open]:slide-in-from-left-1/2 
                    //     data-[state=open]:slide-in-from-top-[48%]
                    //     `}

                    className={`fixed overflow-y-auto
${isSmallScreen
                            ? 'inset-0 w-full h-full rounded-none flex flex-col'
                            : `left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${sizeClasses[size]} max-h-[90vh] rounded-lg`
                        }
bg-white shadow-lg py-1 ${isSmallScreen ? 'px-2' : 'px-4'}
`}
                >
                    {
                        title && <Dialog.Title className="text-4xl font-semibold pb-4 mt-4 mr-12">{title}</Dialog.Title>
                    }
                    <Dialog.Close
                        className={`${handleApplyStyleColor('red')} absolute ${isSmallScreen ? 'right-2' : 'right-4'} top-4 border-none rounded-sm opacity-70 focus:ring-0 focus:outline-none disabled:pointer-events-none`}
                    >
                        <XMarkIcon className="size-8 hover:cursor-pointer" />
                        <span className="sr-only">Close</span>
                    </Dialog.Close>
                    {children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}