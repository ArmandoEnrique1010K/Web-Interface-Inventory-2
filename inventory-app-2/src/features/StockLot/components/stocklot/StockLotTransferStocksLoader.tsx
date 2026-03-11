import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getStockLot } from '../../api/StockLotAPI';
import { TextMessage } from '@/components/TextMessage';
import { StockLotTransferStocksForm } from './StockLotTransferStocksForm';
import type { StockLotDetailsItem } from '../../types';

export const StockLotTransferStocksLoader = () => {

    const params = useParams();
    const stockLotEmitterId = params.id!;

    const { data, isLoading, isError } = useQuery<StockLotDetailsItem>({
        queryKey: ['stock-lot-details', stockLotEmitterId],
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
        <StockLotTransferStocksForm data={data} stockLotEmitterId={stockLotEmitterId} />
    )
}
