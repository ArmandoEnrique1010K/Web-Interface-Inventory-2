import { LinkText } from "@/components/LinkText";
import { movementTypeOptions } from "../data/movementTypeOptions";
import type { MovementItem } from "../schemas/items";

type Props = {
    type?: "url" | "text";
    movementType: MovementItem["movementType"];
    movementId?: number;
};

const movementTypeMap = Object.fromEntries(
    movementTypeOptions.map((item) => [item.value, item]),
);

export const MovementType = ({
    type = "text",
    movementType,
    movementId,
}: Props) => {
    const movement = movementTypeMap[movementType];

    if (!movement) {
        return <span className="text-red-500">Desconocido</span>;
    }

    return (
        <span
            className={`inline-flex justify-center items-center gap-2  ${movement.color} rounded-4xl px-3 py-1 text-sm`}
        >
            <span>{movement.icon}</span>
            {type === "url" ? (
                <LinkText to={`/movements/${movementId}`}>
                    {movement.label}
                </LinkText>
            ) : (
                <span>{movement.label}</span>
            )}
        </span>
    );
};
