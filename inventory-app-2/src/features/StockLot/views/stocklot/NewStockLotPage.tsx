import { useForm } from "react-hook-form";
import type { CompanyItem } from "../../types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { registerStockLot } from "../../api/StockLotAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { InputText } from "@/ui/fields/InputText";
import { SelectOption } from "@/ui/fields/SelectOption";
import { listAllCompanies } from "../../api/CompanyAPI";
import { Button } from "@/ui/Button";
import { ButtonLink } from "@/ui/ButtonLink";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import { AsyncSelectField, type Option } from "@/ui/fields/AsyncSelectOption";
import { listFirstTenModelsByKeyword } from "@/features/Product/api/ModelAPI";

type StockLotFields = {
    quantity: string;
    comment: string;
    modelId: Option | null;
    companyId: string;
};

export const NewStockLotPage = () => {
    const initialValues: StockLotFields = {
        quantity: "",
        comment: "",
        modelId: null,
        companyId: "",
    };

    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
    } = useForm<StockLotFields>({
        defaultValues: initialValues,
    });

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: registerStockLot,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof StockLotFields, {
                        type: "server",
                        message: message as string,
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
        onSuccess: async (data) => {
            toast.success(data);
            navigate("/stocklots");
        },
    });

    const { data: companiesData } = useQuery({
        queryKey: ["companies"],
        queryFn: listAllCompanies,
    });
    const companies =
        companiesData?.map((company: CompanyItem) => ({
            value: company.id,
            label: company.name,
        })) || [];

    return (
        <EntityFormLayout>
            <EntityFormLayout.Header title="Registrar nuevo lote de stock"></EntityFormLayout.Header>
            <EntityFormLayout.Form
                styled
                onSubmit={handleSubmit((data) =>
                    mutate({
                        formData: {
                            ...data,
                            modelId: data.modelId?.value.toString() || "",
                        },
                    }),
                )}
            >
                <EntityFormLayout.Inputs>
                    {/* TODO:, EN UNA FUTURA ACTUALIZACIÓN, EN LA API REST SE PODRIA DEFINIR UN CAMPO PARA COLOCAR LA FECHA, QUE SEA LA FECHA DE HOY O ANTERIOR A ESA PARA REGISTRAR EL LOTE DE ENTREGA */}
                    <InputText
                        id="quantity"
                        label="Cantidad"
                        placeholder="Cantidad o unidades"
                        type="text"
                        errorMessage={errors.quantity}
                        functionEnabled={register("quantity")}
                    />
                    <InputText
                        id="comment"
                        label="Breve comentario"
                        placeholder="Escriba algun breve comentario..."
                        type="text"
                        errorMessage={errors.comment}
                        functionEnabled={register("comment")}
                    />

                    <SelectOption
                        id="companyId"
                        label="Empresa importadora"
                        errorMessage={errors.companyId}
                        functionEnabled={register("companyId")}
                        options={companies}
                        textInNullOption="Seleccione una empresa importadora"
                    />

                    <AsyncSelectField<StockLotFields>
                        label="ID del modelo"
                        name="modelId"
                        control={control}
                        errorMessage={errors.modelId?.message}
                        loadOptions={async (inputValue) => {
                            const data = await listFirstTenModelsByKeyword({
                                keyword: inputValue,
                            });
                            return data.map(
                                (model: {
                                    id: number;
                                    modelProductName: string;
                                }) => ({
                                    value: model.id,
                                    label: model.modelProductName,
                                }),
                            );
                        }}
                    />
                </EntityFormLayout.Inputs>

                <EntityFormLayout.Actions>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Añadir"
                        type="submit"
                        color="green"
                        showIconOnMobile={false}
                        showTextOnMobile
                        applyMinWidth
                        isLargeOnMobile
                    />
                    <ButtonLink
                        icon={<XCircleIcon />}
                        size="large"
                        text="Cancelar"
                        color="gray"
                        to="/stocklots"
                        showIconOnMobile={false}
                        showTextOnMobile
                        applyMinWidth
                        isLargeOnMobile
                    />
                </EntityFormLayout.Actions>
            </EntityFormLayout.Form>
        </EntityFormLayout>
    );
};
