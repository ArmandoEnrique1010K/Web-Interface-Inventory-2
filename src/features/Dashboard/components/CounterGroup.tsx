import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";

type Props = {
    items: {
        textSingular: string;
        textPlural: string;
        value: number;
        to: string;
    }[];
};

export const CounterGroup = ({ items }: Props) => {
    return (
        <div className="grid grid-cols-1  md:grid-cols-6 gap-6">
            {items.map((item, index) => {
                const isFiveLastTwo = items.length === 5 && index >= 3;

                const spanClass =
                    items.length === 1
                        ? "md:col-span-6"
                        : items.length === 4
                          ? "md:col-span-3"
                          : isFiveLastTwo
                            ? "md:col-span-3"
                            : "md:col-span-2";
                return (
                    <div key={item.textPlural} className={spanClass}>
                        <EntityDetailsLayout.CounterItem
                            textSingular={item.textSingular}
                            textPlural={item.textPlural}
                            value={item.value}
                            to={item.to}
                        />
                    </div>
                );
            })}
        </div>
    );
};
