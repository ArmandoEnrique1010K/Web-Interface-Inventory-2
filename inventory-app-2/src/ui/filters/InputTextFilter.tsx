import React from 'react'

type Props = {
    name: string,
    label: string,
    placeholder: string
    type: 'text' | 'number' | 'search'
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const InputTextFilter = ({ name, label, placeholder, type, value, onChange }: Props) => {
    return (
        <>
            <label className="text-md font-bold" htmlFor={name}>{label}</label>

            <input
                className="outline-none focus:outline-none p-2 border border-gray-700 bg-gray-100 rounded w-full"
                type={type}
                placeholder={placeholder}
                id={name}
                name={name}
                onWheel={(e) => e.currentTarget.blur()}
                onChange={onChange}
                value={value}
            />
        </>
    )
}
