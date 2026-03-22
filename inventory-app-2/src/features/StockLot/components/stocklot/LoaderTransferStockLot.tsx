import { useQuery } from '@tanstack/react-query';
import { getStockLot } from '../../api/StockLotAPI';
import { TextMessage } from '@/components/TextMessage';
import { TransferStockLotModal } from './TransferStockLotModal';
import type { StockLotDetailsItem } from '../../types';

type Props = {
    stockLotId: string,
    showModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoaderTransferStockLot = ({ stockLotId, showModal }: Props) => {

    const stockLotEmitterId = stockLotId

    const { data, isLoading, isError } = useQuery<StockLotDetailsItem>({
        queryKey: ['stocklot', stockLotEmitterId],
        queryFn: () => getStockLot(stockLotEmitterId),
        retry: false,
    })

    if (isLoading) {
        return <TextMessage text='Cargando...' align='left' color='black' />
    }

    if (isError) {
        return <TextMessage text='Ha ocurrido un error' align='left' color='red' />
    }

    if (data) return (
        <TransferStockLotModal data={data} stockLotEmitterId={stockLotEmitterId} showModal={showModal} />
    )
}
