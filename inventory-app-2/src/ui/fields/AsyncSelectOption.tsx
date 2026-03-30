import AsyncSelect from "react-select/async";
import type { ControlProps, CSSObjectWithLabel, PlaceholderProps } from "react-select";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

export type Option = {
    label: string;
    value: number | string;
};

type AsyncSelectFieldProps<T extends FieldValues> = {
    label: string;
    name: FieldPath<T>;
    control: Control<T>;
    errorMessage?: string;
    loadOptions: (inputValue: string) => Promise<Option[]>;
    disabled?: boolean; // 👈 nueva prop
};

export function AsyncSelectField<T extends FieldValues>({
    label,
    name,
    control,
    errorMessage,
    loadOptions,
    disabled = false, // valor por defecto
}: AsyncSelectFieldProps<T>) {

    // // debounce para evitar spam
    // const debouncedLoadOptions = debounce(
    //     async (inputValue: string, callback: (options: Option[]) => void) => {
    //         if (!inputValue) return callback([]);

    //         try {
    //             const options = await loadOptions(inputValue);
    //             callback(options);
    //         } catch {
    //             callback([]);
    //         }
    //     },
    //     300
    // );



    // debounce para evitar spam
    const loadOptionsWrapper = async (inputValue: string) => {
        if (!inputValue || disabled) return [];

        try {
            console.log(await loadOptions(inputValue));
            return await loadOptions(inputValue);
        } catch {
            return [];
        }
    };

    // Estilos propios, no funciona con tailwindCSS
    const customStyles = {
        control: (
            // No olvidar el tipado (investigar con IA)
            base: CSSObjectWithLabel,
            state: ControlProps<Option, false>
        ) => ({
            ...base,
            borderRadius: '0.5rem',
            borderColor: state.isFocused ? '#3b82f6' : '#cbd5e1',
            padding: '2px',
            boxShadow: state.isFocused ? '0 0 0 2px #3b82f6' : 'none',
            color: disabled ? 'gray' : 'red',
            '&:hover': {
                color: disabled ? 'gray' : 'rgba(0, 0, 0, 1)',
            },

            // Estilos del campo deshabilitado
            backgroundColor: state.isDisabled ? '#f1f5f9 ' : 'white',
            cursor: 'pointer',
            opacity: 1
        }),

        // Estilos al texto cuando no se ha seleccionado ninguna opción
        placeholder: (base: CSSObjectWithLabel, state: PlaceholderProps<Option, false>) => ({
            ...base,
            color: state.isDisabled ? '#99a1af' : 'black',
        }),


    };


    return (
        <div className="flex flex-col w-full space-y-1">
            <label className="text-sm font-medium text-slate-700">
                {label}:
            </label>

            <div className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <AsyncSelect
                            cacheOptions
                            defaultOptions={false}
                            loadOptions={loadOptionsWrapper}
                            isDisabled={disabled}


                            // onChange={(option: Option | null) => {
                            //     field.onChange(option ? option.value : "");
                            // }}

                            // value={disabled ? '' : field.value?.value}

                            // value={
                            //     field.value
                            //         ? { value: field.value, label: String(field.value) }
                            //         : null
                            // }
                            // value={field.value?.value?.toString() ?? null}
                            value={field.value ?? null}

                            isClearable



                            // onChange={(option: Option | null) =>
                            //     field.onChange(option?.value ?? undefined)
                            // }
                            // onChange={(option: Option | null) => field.onChange(option?.value?.toString())}
                            onChange={(option: Option | null) => field.onChange(option)}
                            onBlur={field.onBlur}
                            placeholder="Escriba aqui para buscar..."
                            styles={customStyles}

                        />
                    )}
                />
            </div>


            <div className="min-h-5">
                {errorMessage && (
                    <p className="text-red-600 text-xs">{errorMessage}</p>
                )}
            </div>
        </div>
    );
}