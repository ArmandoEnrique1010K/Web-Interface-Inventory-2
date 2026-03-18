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
        <div className='flex flex-col w-full space-y-1'>
            <label className="text-sm font-medium text-slate-700" htmlFor={name}>{label}:</label>

            <input
                className="outline-none focus:outline-none border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type={type}
                placeholder={placeholder}
                id={name}
                name={name}
                onWheel={(e) => e.currentTarget.blur()}
                onChange={onChange}
                value={value}
            />
        </div>
    )
}
