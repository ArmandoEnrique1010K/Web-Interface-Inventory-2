const deliveryOrderStatusColors: { status: string; style: string }[] = [
    {
        status: 'Listo',
        style: 'bg-gray-100 text-gray-700'
    },
    {
        status: 'Pendiente',
        style: 'bg-blue-100 text-blue-700'
    },
    {
        status: 'Entregado',
        style: 'bg-green-100 text-green-700'
    },
    {
        status: 'Eliminado',
        style: 'bg-red-100 text-red-700'
    }
]

export const handleApplyDeliveryOrderStatusStyle = (status: 'Listo' | 'Pendiente' | 'Entregado' | 'Eliminado') => {
    return `${deliveryOrderStatusColors.find(deliveryOrderStatusColor => deliveryOrderStatusColor.status === status)?.style}`
}