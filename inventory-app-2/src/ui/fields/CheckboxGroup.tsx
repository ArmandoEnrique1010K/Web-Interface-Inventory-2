import { Controller, type Control, type FieldError, type FieldPath, type FieldValues } from "react-hook-form";

type Option = {
    label: string;
    value: number
    extra?: React.ReactNode; // opcional para mostrar info adicional (ej: stock, lote)
};

type CheckboxGroupProps<T extends FieldValues> = {
    name: FieldPath<T>;
    control: Control<T>;
    options: Option[];
    label: string;
    errorMessage: FieldError | undefined, // Mensaje de error
};

export const CheckboxGroup = <T extends FieldValues>({
    name,
    control,
    options,
    label,
    errorMessage
}: CheckboxGroupProps<T>) => {


    return (
        <div className='flex flex-col w-full space-y-1'>
            <p className="text-sm font-medium text-slate-700">{label}:</p>

            <Controller
                control={control}
                name={name}
                render={({ field }) => {
                    const selectedValues: number[] = field.value || [];

                    const handleChange = (value: number) => {
                        if (selectedValues.includes(value)) {
                            field.onChange(selectedValues.filter((v: number) => v !== value));
                        } else {
                            field.onChange([...selectedValues, value]);
                        }
                    };

                    return (
                        <div className="flex flex-col space-y-1">
                            {options.map(option => (
                                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedValues.includes(option.value)}
                                        onChange={() => handleChange(option.value)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border border-slate-300 rounded-lg outline-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"

                                    />
                                    <span className="text-base text-gray-700 cursor-pointer"
                                    >{option.label}</span>
                                    {option.extra}
                                </label>
                            ))}

                            <div className='min-h-5'>
                                <p className="text-red-600 text-xs mt-1">
                                    {errorMessage?.message}
                                </p>
                            </div>
                        </div>
                    );
                }}
            />
        </div>
    );
};