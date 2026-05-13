import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../../../api/ProductAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { Button } from "@/ui/Button";
import { InputText } from "@/ui/fields/InputText";
import { SelectOption } from "@/ui/fields/SelectOption";
import { listAllActiveCategories } from "../../../api/CategoryAPI";
import { listAllActiveTypes } from "../../../api/TypeAPI";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import type { ProductUpdateForm } from "../../../schemas/requests";
import { useAuthRole } from "@/hooks/useAuthRole";

type Props = {
    data: ProductUpdateForm;
    productId: number;
    modelId?: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EditProductModal = ({
    data,
    productId,
    modelId,
    setShowModal,
}: Props) => {
    const initialValues = {
        name: data.name,
        length: data.length,
        width: data.width,
        height: data.height,
        categoryId: data.categoryId,
        typeId: data.typeId,
    };

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<ProductUpdateForm>({
        defaultValues: initialValues,
    });
    const { userRole } = useAuthRole();

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: updateProduct,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof ProductUpdateForm, {
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
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", productId] });
            queryClient.invalidateQueries({ queryKey: ["models"] });
            if (modelId) {
                queryClient.invalidateQueries({ queryKey: ["model", modelId] });
            }
            queryClient.invalidateQueries({
                queryKey: ["dashboard", userRole],
            });
            toast.success(data);
            setShowModal(false);
        },
    });

    const handleForm = (formData: ProductUpdateForm) => {
        const data = {
            formData,
            productId,
        };
        mutate(data);
    };
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
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form
                styled={false}
                onSubmit={handleSubmit(handleForm)}
            >
                <EntityFormLayout.Inputs isCompact>
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
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions isCompact>
                    <>
                        <Button
                            icon={<ArrowUpCircleIcon />}
                            size="large"
                            text="Editar"
                            type="submit"
                            color="green"
                            disabled={isPending}
                            showIconOnMobile={false}
                            showTextOnMobile={true}
                            isLargeOnMobile={true}
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
                            showTextOnMobile={true}
                            isLargeOnMobile={true}
                            applyMinWidth
                        />
                    </>
                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout>
    );
};
