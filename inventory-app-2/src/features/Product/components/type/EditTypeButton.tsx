import { Modal } from '@/components/Modal';
import { Button } from '@/ui/Button';
import { useState } from 'react'
import { LoaderType } from './LoaderType';

type Props = {
    typeId: number
}

export const EditTypeButton = ({ typeId }: Props) => {

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                type='button'
                size="small"
                text="Editar"
                color="blue"
                onClick={() => {
                    setShowModal(true)
                }}
                showTextOnMobile
            />
            {
                showModal && <Modal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false)
                    }}
                    size='lg'
                    title={`Editar tipo #${typeId}`}
                    locked
                >
                    <LoaderType
                        typeId={typeId}
                        setModalOpen={setShowModal}
                    />
                </Modal>
            }
        </>
    )
}
