import type { DeliveryOrderItem } from "../../schemas/items";
import { deliveryOrderOnTimeStatusOptions } from "../../data/deliveryOrderOnTimeStatusOptions";

type Props = {
    deliveryOrderOnTimeStatus: DeliveryOrderItem["onTimeStatus"];
};

const deliveryOrderMap = Object.fromEntries(
    deliveryOrderOnTimeStatusOptions.map((item) => [item.value, item]),
);

export const DeliveryOrderOnTimeStatus = ({
    deliveryOrderOnTimeStatus,
}: Props) => {
    const deliveryOrder = deliveryOrderMap[deliveryOrderOnTimeStatus];

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
