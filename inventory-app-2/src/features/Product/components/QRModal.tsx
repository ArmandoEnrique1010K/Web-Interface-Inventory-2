import { Modal } from '@/components/Modal'
import QRCode from 'react-qr-code'

interface QRModalProps {
    isOpen: boolean
    onClose: () => void
    url: string
}

export const QRModal = ({ isOpen, onClose, url }: QRModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <div className='my-4'>
                Toma captura del QR para compartir el producto
            </div>
            <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                    <QRCode value={url} size={200} />
                </div>
                <p className="text-sm text-gray-600 text-center">{url}</p>
            </div>
        </Modal>
    )
}