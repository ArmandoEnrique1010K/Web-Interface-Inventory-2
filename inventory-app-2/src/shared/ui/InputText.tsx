type Props = {
    name: string; // Nombre del input
    placeholder: string; // Texto que se muestra en el input
    type: string; // Tipo de input (text, password, email, etc)
}

export const InputText = ({ name, placeholder, type }: Props) => {
    return (
        <>
            <label htmlFor={name}>{name}</label>
            <input type={type} placeholder={placeholder} name={name} />
        </>
    )
}
