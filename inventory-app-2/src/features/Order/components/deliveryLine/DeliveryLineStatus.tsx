import type { DeliveryLineItem } from "../../schemas/items";
import { handleApplyDeliveryLineStatusStyle } from "@/utils/handleApplyDeliveryLineStatusStyle";

type Props = {
    deliveryLineStatus: DeliveryLineItem["lineStatus"];
    label?: string;
};

export const DeliveryLineStatus = ({
    deliveryLineStatus: deliveryOrderStatus,
    label,
}: Props) => {
    return (
        <div>
            <span
                className={`
                    px-3 py-1 rounded-4xl 
                    ${handleApplyDeliveryLineStatusStyle(deliveryOrderStatus)}
                `}
            >
                {label}
            </span>
        </div>
    );
};
