import type { DeliveryOrderItem } from "../../schemas/items";
import { deliveryOrderStatusOptions } from "../../data/deliveryOrderStatusOptions";

type Props = {
    deliveryOrderStatus: DeliveryOrderItem["orderStatus"];
};

const deliveryOrderMap = Object.fromEntries(
    deliveryOrderStatusOptions.map((item) => [item.value, item]),
);

export const DeliveryOrderStatus = ({ deliveryOrderStatus }: Props) => {
    const deliveryOrder = deliveryOrderMap[deliveryOrderStatus];

    if (!deliveryOrder) {
        return <span className="text-red-500">Desconocido</span>;
    }

    return (
        <div>
            <span
                className={`
                    px-3 py-1 rounded-4xl 
                    ${deliveryOrder.color}
                `}
            >
                {deliveryOrder.label}
            </span>
        </div>
    );
};
