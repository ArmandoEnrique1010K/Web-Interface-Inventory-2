import { deliveryLineStatusOptions } from "../../data/deliveryLineStatusOptions";
import type { DeliveryLineItem } from "../../schemas/items";

type Props = {
    deliveryLineStatus: DeliveryLineItem["lineStatus"];
};

const deliveryLineMap = Object.fromEntries(
    deliveryLineStatusOptions.map((item) => [item.value, item]),
);

export const DeliveryLineStatus = ({ deliveryLineStatus }: Props) => {
    const deliveryLine = deliveryLineMap[deliveryLineStatus];
    if (!deliveryLine) {
        return <span className="text-red-500">Desconocido</span>;
    }

    return (
        <div>
            <span
                className={`
                    px-3 py-1 rounded-4xl 
                    ${deliveryLine.color}
                `}
            >
                {deliveryLine.label}
            </span>
        </div>
    );
};
