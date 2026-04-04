import { handleApplyDeliveryOrderStatusStyle } from "@/utils/handleApplyDeliveryOrderStatusStyle";
import type { DeliveryOrderItem } from "../../schemas/items";

type Props = {
    deliveryOrderStatus: DeliveryOrderItem["orderStatus"];
    label?: string;
};

export const DeliveryOrderStatus = ({ deliveryOrderStatus, label }: Props) => {
    return (
        <div>
            <span
                className={`
                    px-3 py-1 rounded-4xl 
                    ${handleApplyDeliveryOrderStatusStyle(deliveryOrderStatus)}
                `}
            >
                {label}
            </span>
        </div>
    );
};
