type Props = {
    value: number;
};

const applyColor = (value: number) => {
    if (value <= 50) {
        return "bg-red-100 text-red-700";
    } else if (value <= 99.9) {
        return "bg-amber-100 text-amber-700";
    } else {
        return "bg-emerald-100 text-emerald-700";
    }
};

export const PercentageText = ({ value }: Props) => {
    return (
        <>
            <div
                className={`
                    inline-flex items-center justify-center 
        font-medium
        select-none
        whitespace-nowrap
        gap-2
text-lg py-2 rounded-lg
px-8 sm:min-w-[240px]

${applyColor(value)}
            `}
            >
                {value + "% completado"}
            </div>
        </>
    );
};
