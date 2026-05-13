type Props = {
    data: React.ReactNode | string;
    isCenter?: boolean;
    rowSpan?: number;
};

export const BaseTableCell = ({ data, isCenter, rowSpan }: Props) => {
    return (
        <td
            className={`
            border border-gray-300 px-4 py-3
            ${isCenter ? "text-center" : ""}
        `}
            rowSpan={rowSpan}
        >
            {data}
        </td>
    );
};
