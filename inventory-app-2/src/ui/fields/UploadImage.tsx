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
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="font-bold">
                {label}
            </label>

            <input
                id={id}
                type="file"
                accept="image/*"
                {...register}
                onChange={handleChange}
            />

            {previewImage && (
                <img
                    src={previewImage}
                    alt="preview"
                    className="w-40 mt-2 rounded"
                />
            )}
        </div>
    )
}