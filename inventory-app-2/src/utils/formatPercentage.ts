export const formatPercentage = (value: number) => {
    return (value * 100).toFixed(2).replace(/\.?0+$/, "") + " %";
};
