type Props = {
    value: boolean;
};

export const StatusText = ({ value }: Props) => {
    return (
        <span
            className={`inline-flex text-sm px-4 py-2 rounded-lg ${value ? "bg-emerald-100 text-emerald-700 " : "bg-red-100 text-red-700"}`}
        >
            {value ? "Activo" : "Inactivo"}
        </span>
    );
};
