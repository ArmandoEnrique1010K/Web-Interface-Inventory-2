import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GeneralError } from "@/types/index";
import { registerProduct } from "../../api/ProductAPI";
import { toast } from "sonner";
import { InputText } from "@/ui/fields/InputText";
import { Button } from "@/ui/Button";
import { InputDate } from "@/ui/fields/InputDate";
import { SelectOption } from "@/ui/fields/SelectOption";
import { listAllActiveCategories } from "../../api/CategoryAPI";
import { listAllActiveTypes } from "../../api/TypeAPI";
import { ButtonLink } from "@/ui/ButtonLink";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { UploadImage } from "@/ui/fields/UploadImage";
import { Subtitle } from "@/components/Subtitle";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import type { ProductCreateForm } from "../../schemas/requests";
import { useAuthRole } from "@/hooks/useAuthRole";

export const NewProductPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const initialValues = {
        name: "",
        length: undefined,
        width: undefined,
        height: undefined,
        modelName: "",
        // SELECCIONA LA FECHA DE HOY EN DIA
        modelEntryDate: new Date(new Date().setHours(12))
            .toISOString()
            .split("T")[0],
        modelCaducityDate: "", //new Date(new Date().setHours(12)).toISOString().split('T')[0],
        categoryId: undefined,
        typeId: undefined,
    };

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { userRole } = useAuthRole();

    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors },
    } = useForm<ProductCreateForm & { file: File }>({
        defaultValues: initialValues,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: registerProduct,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof ProductCreateForm, {
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
            queryClient.invalidateQueries({
                queryKey: ["dashboard", userRole],
            });
            toast.success(data);
            navigate("/products");
        },
    });

    // TODO: EN ALGUNA FUTURA ACTUALIZACION SE PUEDE HACER QUE SE MUESTRE UNA NOTIFICACION MIENTRAS SE SUBE LA IMAGEN
    const { data: categoriesData } = useQuery({
        queryKey: ["categories", "active"],
        queryFn: listAllActiveCategories,
    });

    const { data: typesData } = useQuery({
        queryKey: ["types", "active"],
        queryFn: listAllActiveTypes,
    });

    const categories =
        categoriesData?.map((category) => ({
            value: category.id.toString(),
            label: category.name,
        })) || [];

    const types =
        typesData?.map((type) => ({
            value: type.id.toString(),
            label: type.name,
        })) || [];

    return (
        <EntityFormLayout>
            <EntityFormLayout.Header title="Agregar nuevo producto"></EntityFormLayout.Header>

            <EntityFormLayout.Form
                styled
                onSubmit={handleSubmit((data) => {
                    mutate({
                        data: data,
                        ...(file && { file }),
                    });
                })}
            >
                <EntityFormLayout.Inputs>
                    <div className="pb-2">
                        <Subtitle>Producto</Subtitle>
                    </div>
                    <InputText
                        id="name"
                        label="Nombre"
                        placeholder="Nombre del producto"
                        type="text"
                        errorMessage={errors.name}
                        functionEnabled={register("name")}
                    />

                    <InputText
                        id="length"
                        label="Largo (cm.)"
                        placeholder="Medida del largo"
                        type="number"
                        errorMessage={errors.length}
                        functionEnabled={register("length")}
                    />

                    <InputText
                        id="width"
                        label="Ancho (cm.)"
                        placeholder="Medida del ancho"
                        type="number"
                        errorMessage={errors.width}
                        functionEnabled={register("width")}
                    />

                    <InputText
                        id="height"
                        label="Alto (cm.)"
                        placeholder="Medida de la altura"
                        type="number"
                        errorMessage={errors.height}
                        functionEnabled={register("height")}
                    />

                    <hr className="my-6 border-slate-200" />
                    <div className="pb-2">
                        <Subtitle>Primer modelo</Subtitle>
                    </div>

                    <InputText
                        id="modelName"
                        label="Nombre"
                        placeholder="Nombre del modelo"
                        type="text"
                        errorMessage={errors.modelName}
                        functionEnabled={register("modelName")}
                    />

                    <InputText
                        id="modelMinimumAvailableQuantity"
                        label="Cantidad minima para declarar bajo stock"
                        placeholder="Cantidad minima"
                        type="number"
                        errorMessage={errors.modelMinimumAvailableQuantity}
                        functionEnabled={register(
                            "modelMinimumAvailableQuantity",
                        )}
                    />

                    {/** NOTA: SI NO SUBE UNA FECHA DE ENTRADA, SE ESTABLECERA LA FECHA DE HOY DIA */}
                    <InputDate<ProductCreateForm & { file: File }>
                        id="modelEntryDate"
                        label="Fecha de entrada"
                        name="modelEntryDate"
                        control={control}
                        errorMessage={errors.modelEntryDate?.message}
                    />
                    <InputDate<ProductCreateForm & { file: File }>
                        id="modelCaducityDate"
                        label="Fecha de caducidad"
                        name="modelCaducityDate"
                        control={control}
                        errorMessage={errors.modelCaducityDate?.message}
                    />

                    <SelectOption
                        id="categoryId"
                        label="Categoria"
                        errorMessage={errors.categoryId}
                        functionEnabled={register("categoryId")}
                        options={categories}
                        textInNullOption="Seleccione una categoria"
                    />

                    <SelectOption
                        id="typeId"
                        label="Tipo"
                        errorMessage={errors.typeId}
                        functionEnabled={register("typeId")}
                        options={types}
                        textInNullOption="Seleccione un tipo"
                    />
                    {/* INPUT DE TIPO IMAGE ANTES DE SEPARARLO EN UN COMPONENTE APARTE */}

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

                    {/* Componente para cargar la imagen, contiene el boton y la previsualizacion de la imagen */}
                    <UploadImage
                        id="file"
                        label="Imagen"
                        register={register("file")}
                        previewImage={preview}
                        setFile={setFile}
                        setPreview={setPreview}
                    />
                </EntityFormLayout.Inputs>

                <EntityFormLayout.Actions>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        disabled={isPending}
                        size="large"
                        text="Añadir"
                        type="submit"
                        color="green"
                        showTextOnMobile
                        showIconOnMobile={false}
                        isLargeOnMobile
                        applyMinWidth
                    />
                    <ButtonLink
                        icon={<XCircleIcon />}
                        size="large"
                        text="Cancelar"
                        color="gray"
                        to="/products"
                        showTextOnMobile
                        showIconOnMobile={false}
                        isLargeOnMobile
                        applyMinWidth
                    />
                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout>
    );
};
