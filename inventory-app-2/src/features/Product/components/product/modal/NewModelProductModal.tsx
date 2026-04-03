import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerModelInProduct } from "../../../api/ModelAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { InputText } from "@/ui/fields/InputText";
import { InputDate } from "@/ui/fields/InputDate";
import { Button } from "@/ui/Button";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { UploadImage } from "@/ui/fields/UploadImage";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import type { ModelForm } from "../../../schemas/requests";

type Props = {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    productId: number;
};

export const NewModelProductModal = ({ setShowModal, productId }: Props) => {
    // const { id } = useParams();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const initialValues: ModelForm = {
        name: "",
        // SELECCIONA LA FECHA DE HOY EN DIA (Valor por defecto), Tambien debe ser una fecha pasada o de hoy o ningun valor
        entryDate: new Date(new Date().setHours(12))
            .toISOString()
            .split("T")[0], // 2026-03-11 -> String
        // La fecha de caducidad debe ser futura o ningun valor
        caducityDate: "",
    };

    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors },
    } = useForm<ModelForm & { file: File }>({
        defaultValues: initialValues,
    });
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: registerModelInProduct,
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
            toast.success(data);
            setShowModal(false);
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", productId] });
            queryClient.invalidateQueries({ queryKey: ["models"] });
        },
    });

    // EFECTO QUE SE EJECUTA SI HAY UNA IMAGEN QUE SE ESTA SUBIENDO
    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form
                styled={false}
                onSubmit={handleSubmit((data) => {
                    mutate({
                        productId: productId,
                        data: data,
                        ...(file && { file }),
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
                        label="Suba una imagen"
                        register={register("file")}
                        previewImage={preview}
                        setFile={setFile}
                        setPreview={setPreview}
                    />

                    <InputDate<ModelForm & { file: File }>
                        id="entryDate"
                        label="Fecha de entrada del modelo"
                        name="entryDate"
                        control={control}
                        errorMessage={errors.entryDate?.message}
                    />

                    <InputDate<ModelForm & { file: File }>
                        id="caducityDate"
                        label="Fecha de caducidad del modelo"
                        name="caducityDate"
                        control={control}
                        errorMessage={errors.caducityDate?.message}
                    />
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions isCompact>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Añadir"
                        type="submit"
                        color="green"
                        showIconOnMobile={false}
                        showTextOnMobile={true}
                        isLargeOnMobile={true}
                        applyMinWidth
                        disabled={isPending}
                    />
                    <Button
                        icon={<XCircleIcon />}
                        type="button"
                        size="large"
                        text="Cancelar"
                        color="gray"
                        onClick={() => {
                            setShowModal(false);
                        }}
                        showIconOnMobile={false}
                        showTextOnMobile={true}
                        isLargeOnMobile={true}
                        applyMinWidth
                    />
                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout>
    );
};
