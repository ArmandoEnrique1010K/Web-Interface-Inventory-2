import type { UseFormRegisterReturn } from 'react-hook-form';

type Props = {
    group: {
        name: string;
        action: UseFormRegisterReturn;
    }[],
    label: string
}

export const SelectCheckboxGroup = ({ group, label }: Props) => {
    return (
        <div className='flex flex-col w-full space-y-1'>
            <label className="text-sm font-medium text-slate-700" htmlFor={label}>{label}:</label>
            <div className="flex flex-col space-y-1">
                {
                    group.map((option) => (
                        <div key={option.name} className="flex items-center gap-2">
                            <input
                                id={`${option.name}`}
                                type="checkbox"
                                {...option.action}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border border-slate-300 rounded-lg outline-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            />
                            <label
                                htmlFor={`${option.name}`}
                                className="text-base text-gray-700 cursor-pointer"
                            >
                                {option.name}
                            </label>
                        </div>

                    ))
                }

                <div className='min-h-5'>

                </div>
            </div>

        </div>
    )
}
