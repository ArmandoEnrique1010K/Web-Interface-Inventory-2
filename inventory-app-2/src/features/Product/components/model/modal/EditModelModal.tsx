import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateModel } from "../../../api/ModelAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { InputText } from "@/ui/fields/InputText";
import { InputDate } from "@/ui/fields/InputDate";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/ui/Button";
import { useState } from "react";
import { UploadImage } from "@/ui/fields/UploadImage";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import type { ModelForm } from "../../../schemas/requests";
import type { ModelItem } from "../../../schemas/items";

type Props = {
    data: ModelItem & { file: File };
    modelId: string;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EditModelModal = ({ data, modelId, setShowModal }: Props) => {
    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors },
    } = useForm<ModelForm & { file: File }>({
        defaultValues: {
            name: data.name,
            entryDate: data.entryDate,
            caducityDate: data.caducityDate,
        },
    });

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(data.imageUrl);

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: updateModel,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof ModelForm, {
                        type: "server",
                        message: message,
                    });
                });

                toast.error(e.message);
                return;
            }

            if (e.type === "GENERAL_ERROR") {
                toast.error(e.message);
                return;
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["models"] });
            queryClient.invalidateQueries({ queryKey: ["model", +modelId] });
            toast.success(data);
            // navigate(`/products/${productId}?modelId=${modelId}`)
            setShowModal(false);
        },
    });

    const handleForm = (formData: ModelForm & { file: File }) => {
        const data = {
            data: formData,
            modelId: +modelId,
            ...(file && { file }), // Only include file if it exists
        };
        mutate(data);
    };

    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form
                styled={false}
                onSubmit={handleSubmit((data) => {
                    handleForm({
                        ...data,
                        file: file || data.file,
                    });
                })}
            >
                <EntityFormLayout.Inputs isCompact>
                    <InputText
                        id="name"
                        label="Nombre"
                        placeholder="Nombre del modelo"
                        type="text"
                        errorMessage={errors.name}
                        functionEnabled={register("name")}
                    />

                    <InputDate<ModelForm & { file: File }>
                        id="entryDate"
                        label="Fecha de entrada"
                        name="entryDate"
                        control={control}
                        errorMessage={errors.entryDate?.message}
                    />
                    <InputDate<ModelForm & { file: File }>
                        id="caducityDate"
                        label="Fecha de caducidad"
                        name="caducityDate"
                        control={control}
                        errorMessage={errors.caducityDate?.message}
                    />

                    {/* <input
                                type="file"
                                accept="image/*"
                                {...register("file", {
                                    onChange: (e) => {
                                        const selectedFile = e.target.files?.[0]

                                        if (selectedFile) {
                                            setFile(selectedFile)
                                            setPreview(URL.createObjectURL(selectedFile))
                                        }
                                    }
                                })}
                            />
                            {preview && (
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="w-40 mt-2 rounded"
                                />
                            )} */}
                    <UploadImage
                        id="file"
                        label="Imagen"
                        register={register("file")}
                        previewImage={preview}
                        setFile={setFile}
                        setPreview={setPreview}
                    />
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions isCompact>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Editar modelo"
                        type="submit"
                        color="green"
                        disabled={isPending}
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                        applyMinWidth
                    />
                    <Button
                        type="button"
                        icon={<XCircleIcon />}
                        size="large"
                        text="Cancelar"
                        color="gray"
                        onClick={() => setShowModal(false)}
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                        applyMinWidth
                    />
                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout>
    );
};
