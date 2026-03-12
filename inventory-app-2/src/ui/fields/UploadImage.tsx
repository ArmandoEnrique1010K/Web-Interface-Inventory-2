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

        if (selectedFile) {
            setFile(selectedFile)
            setPreview(URL.createObjectURL(selectedFile))
        }

        // importante: mantener el onChange de react-hook-form
        register.onChange(e)
    }

    return (
        <div className="flex flex-col space-y-1">
            <label className="font-bold">{label}</label>

            {/* Input oculto */}
            <input
                id={id}
                type="file"
                accept="image/*"
                className="hidden"
                {...register}
                onChange={handleChange}
            />

            {/* TODO: POR ALGUNA RAZON NO PUEDO RENDERIZAR AQUI EL COMPONENTE PROPIO <Button/> */}
            {/* Botón estilizado */}
            <label
                htmlFor={id}
                className="
        inline-flex items-center justify-center 
        text-white
        cursor-pointer
        transition-all duration-200
        font-sans
        select-none
        whitespace-nowrap
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                 text-lg font-semibold py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700
                 w-max
                 "
            >
                Seleccionar archivo
            </label>

            {previewImage && (
                <img
                    src={previewImage}
                    alt="preview"
                    className="w-60 mt-2 rounded border"
                />
            )}

            <div className="min-h-6"></div>
        </div>
    )
}