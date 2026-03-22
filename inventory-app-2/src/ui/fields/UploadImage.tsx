import type { UseFormRegisterReturn } from "react-hook-form"

type Props = {
    id: string
    label: string
    register: UseFormRegisterReturn
    previewImage: string | null
    setFile: React.Dispatch<React.SetStateAction<File | null>>
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
}

export const UploadImage = ({
    id,
    label,
    register,
    previewImage,
    setFile,
    setPreview
}: Props) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]

        if (!selectedFile) return

        if (selectedFile) {
            // Obtiene el tipo de dato del archivo
            console.log(selectedFile.type);

            // Si no coincide con el tipo de archivo image
            if (!selectedFile.type.startsWith('image/')) {
                setFile(null)
                setPreview(null)
                return
            }

            setFile(selectedFile)
            setPreview(URL.createObjectURL(selectedFile))
        }

        // importante: mantener el onChange de react-hook-form
        register.onChange(e)
    }

    return (
        <div className="flex flex-col w-full space-y-1">
            <label className="text-sm font-medium text-slate-700">{label}:</label>

            {/* Input oculto */}
            <input
                id={id}
                type="file"
                accept="image/*"
                className="hidden"
                {...register}
                onChange={handleChange}
            />

            {/* Botón estilizado */}
            <label
                htmlFor={id}
                className="
                    inline-flex items-center justify-center 
                    font-medium
                    select-none
                    whitespace-nowrap
                    cursor-pointer
                    transition-all duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                    active:scale-95
                    text-base px-4 py-2 rounded-lg
                    bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500 text-white
                 "
            >
                Seleccione un archivo
            </label>
            {previewImage && (
                <img
                    src={previewImage}
                    alt="preview"
                    className="max-h-80 max-w-full object-contain bg-white shadow-sm rounded-xl border border-gray-200 mt-2"
                />
            )}


            <div className='min-h-5'>
            </div>
        </div>
    )
}