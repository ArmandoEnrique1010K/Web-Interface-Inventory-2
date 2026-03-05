type Props = {
    name: string,
    value: string | number,
}

// TODO: ELIMINAR ESTE COMPONENTE
export const ListItem = ({ name, value }: Props) => {
    return (
        <div className="flex flex-row w-full bg-white border border-blue-600">
            <div className="font-semibold bg-blue-500 text-white p-2">{name}</div>
            <div className="p-2">{value}</div>
        </div>
    )
}
