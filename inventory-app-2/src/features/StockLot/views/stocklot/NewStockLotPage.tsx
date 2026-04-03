import { useForm } from "react-hook-form";
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
    quantity: number | undefined;
    comment: string;
    modelId: Option | null;
    companyId: number | undefined;
};

export const NewStockLotPage = () => {
    const initialValues: StockLotFields = {
        quantity: undefined,
        comment: "",
        modelId: null,
        companyId: undefined,
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
        onSuccess: (data) => {
            toast.success(data);
            navigate("/stocklots");
        },
    });

    const { data: companiesData } = useQuery({
        queryKey: ["companies"],
        queryFn: listAllCompanies,
    });
    const companies =
        companiesData?.map((company) => ({
            value: company.id.toString(),
            label: company.name,
        })) || [];

    return (
        <EntityFormLayout>
            <EntityFormLayout.Header title="Registrar nuevo lote de stock"></EntityFormLayout.Header>
            <EntityFormLayout.Form
                styled
                onSubmit={handleSubmit(
                    (data) => {
                        mutate({
                            quantity: data.quantity!,
                            comment: data.comment,
                            modelId: Number(data.modelId?.value),
                            // modelId:
                            //     data.modelId === null
                            //         ? // Cambiar el tipo de modelId a una union de Number y Null,
                            //           // para que sea posible que sea null, y en ese caso no tengamos que
                            //           // hacer el cast a Number
                            //           Number(data.modelId?.value)
                            //         : Number(data.modelId?.value),
                            companyId: data.companyId!,
                        });
                    },

                    // mutate({
                    //     ...data,
                    //     modelId: +data.modelId?.value,
                    // }),
                )}
            >
                <EntityFormLayout.Inputs>
                    {/* TODO:, EN UNA FUTURA ACTUALIZACIÓN, EN LA API REST SE PODRIA DEFINIR UN CAMPO PARA COLOCAR LA FECHA, QUE SEA LA FECHA DE HOY O ANTERIOR A ESA PARA REGISTRAR EL LOTE DE ENTREGA */}
                    <InputText
                        id="quantity"
                        label="Cantidad"
                        placeholder="Cantidad o unidades"
                        type="number"
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
                    {/* //* SOLAMENTE SE ENVIA EL ID DEL MODELO */}
                    <AsyncSelectField<StockLotFields>
                        label="Nombre del producto y modelo"
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
