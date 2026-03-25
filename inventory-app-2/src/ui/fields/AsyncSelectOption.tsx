import AsyncSelect from "react-select/async";
import type { ControlProps, CSSObjectWithLabel } from "react-select";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import debounce from 'lodash.debounce';

type Option = {
    label: string;
    value: number | string;
};

type AsyncSelectFieldProps<T extends FieldValues> = {
    label: string;
    name: FieldPath<T>;
    control: Control<T>;
    errorMessage?: string;
    loadOptions: (inputValue: string) => Promise<Option[]>;
};

export function AsyncSelectField<T extends FieldValues>({
    label,
    name,
    control,
    errorMessage,
    loadOptions,
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
    const debouncedLoadOptions = debounce(
        async (inputValue: string) => {
            if (!inputValue) return [];

            try {
                const options = await loadOptions(inputValue);
                return options;
            } catch {
                return [];
            }
        },
        200 // El usuario debe escribir en el campo durante 200 milisegundos para mostrar los resultados
    );


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
            '&:hover': {
                borderColor: '#cbd5e1'
            }
        })
    };

    return (
        <div className="flex flex-col w-full space-y-1">
            <label className="text-sm font-medium text-slate-700">
                {label}
            </label>

            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <AsyncSelect
                        cacheOptions
                        defaultOptions={false}
                        loadOptions={debouncedLoadOptions}
                        onChange={(option: Option | null) => {
                            field.onChange(option ? option.value : "");
                        }}
                        onBlur={field.onBlur}
                        placeholder="Escriba aqui para buscar..."
                        styles={customStyles}

                    />
                )}
            />

            <div className="min-h-5">
                {errorMessage && (
                    <p className="text-red-600 text-xs">{errorMessage}</p>
                )}
            </div>
        </div>
    );
}