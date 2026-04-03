import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { GeneralError } from "@/types/index";
import { registerDeliveryOrder } from "../../api/DeliveryOrderAPI";
import { toast } from "sonner";
import { listFirstTenUsersByKeyword } from "@/features/User/api/UserAPI";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import { Button } from "@/ui/Button";
import { ButtonLink } from "@/ui/ButtonLink";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { InputDateTime } from "@/ui/fields/InputDateTime";
import { AsyncSelectField, type Option } from "@/ui/fields/AsyncSelectOption";

type DeliveryOrderFormFields = {
    limitDate: string;
    userIdClient: Option | null;
};

export const NewDeliveryOrderPage = () => {
    const initialValues: DeliveryOrderFormFields = {
        limitDate: "",
        userIdClient: null,
    };

    // NOTA: NO SE UTILIZA LA FUNCIÓN DE register
    const {
        handleSubmit,
        setError,
        control,
        formState: { errors },
    } = useForm<DeliveryOrderFormFields>({
        defaultValues: initialValues,
    });
    const navigate = useNavigate();
    const { mutate } = useMutation({
        mutationFn: registerDeliveryOrder,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof DeliveryOrderFormFields, {
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
            navigate("/orders");
        },
    });

    return (
        <EntityFormLayout>
            <EntityFormLayout.Header title="Agregar nueva orden de entrega"></EntityFormLayout.Header>
            <EntityFormLayout.Form
                styled
                onSubmit={handleSubmit((data) => {
                    // mutate(data)

                    mutate({
                        formData: {
                            ...data,
                            userIdClient:
                                data.userIdClient?.value.toString() || "",
                        },
                    });
                })}
            >
                <EntityFormLayout.Inputs>
                    <InputDateTime<DeliveryOrderFormFields>
                        id="limitDate"
                        label="Fecha limite de entrega"
                        name="limitDate"
                        control={control}
                        errorMessage={errors.limitDate?.message}
                    />

                    {/* INPUT PARA FILTRAR */}
                    {/* SELECT CON RESULTADOS */}

                    {/* <div className="flex flex-col gap-2">
                        <label>Buscar cliente</label>
                        <input
                            type="text"
                            placeholder="Escribe el nombre..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="border rounded-lg p-2"
                        />
                    </div>

                    <SelectOption
                        id="userIdClient"
                        label='Cliente'
                        errorMessage={errors.userIdClient}
                        functionEnabled={register('userIdClient')}
                        options={options}
                        textInNullOption={
                            isLoading
                                ? 'Buscando...'
                                : options.length === 0
                                    ? 'Sin resultados'
                                    : 'Seleccione un cliente'
                        }
                    /> */}
                    <AsyncSelectField<DeliveryOrderFormFields>
                        label="Cliente"
                        name="userIdClient"
                        control={control}
                        errorMessage={errors.userIdClient?.message}
                        loadOptions={async (inputValue) => {
                            const data = await listFirstTenUsersByKeyword({
                                name: inputValue,
                            });
                            return data.map(
                                (user: { id: number; fullName: string }) => ({
                                    value: user.id,
                                    label: user.fullName,
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
                        isLargeOnMobile
                        applyMinWidth
                    />
                    <ButtonLink
                        icon={<XCircleIcon />}
                        size="large"
                        text="Cancelar"
                        color="gray"
                        to="/orders"
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
