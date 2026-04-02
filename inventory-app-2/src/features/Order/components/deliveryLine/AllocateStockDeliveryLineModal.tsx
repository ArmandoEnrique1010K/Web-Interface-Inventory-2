import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DeliveryLineAllocateForm } from "../../types";
import { useForm, useWatch, type FieldError } from "react-hook-form";
import { allocateStockInDeliveryLine } from "../../api/DeliveryLineAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import { InputText } from "@/ui/fields/InputText";
import { Button } from "@/ui/Button";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { listAllStockLotsActiveByModel } from "@/features/StockLot/api/StockLotAPI";
import type { StockLotSameProductItem } from "@/features/StockLot/types";
import { CheckboxGroup } from "@/ui/fields/CheckboxGroup";
import { useEffect } from "react";

type Props = {
    setAllocateStockModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    deliveryLineId: string;
    deliveryOrderId: string;
    modelId: string;
};

export const AllocateStockDeliveryLineModal = ({
    deliveryLineId,
    deliveryOrderId,
    modelId,
    setAllocateStockModalOpen,
}: Props) => {
    // LIMPIEZA + CONTROL
    const storedModelId = sessionStorage.getItem("currentModelId");

    if (storedModelId !== modelId.toString()) {
        // console.log(typeof storedModelId)
        // console.log(typeof modelId) // TODO: POR ALGUNA RAZON ES NUMBER
        sessionStorage.removeItem("stockLotsSelected");
    }

    sessionStorage.setItem("currentModelId", modelId);

    // HIDRATACIÓN
    const storedStockLots = sessionStorage.getItem("stockLotsSelected");

    const initialValues: DeliveryLineAllocateForm = {
        quantity: "",
        stockLotsIds: storedStockLots ? JSON.parse(storedStockLots) : [], // Numero de IDs de los lotes de stock
    };

    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors },
    } = useForm<DeliveryLineAllocateForm>({
        defaultValues: initialValues,
    });

    const queryClient = useQueryClient();

    // Query para obtener los lotes de stocks activos que correspondan al modelo de la linea de entrega
    // llamar a listAllStockLotsActiveByModel, requiere el modelId
    const { data: stockLotsData } = useQuery<StockLotSameProductItem[]>({
        queryKey: ["stockLots", modelId],
        queryFn: () => listAllStockLotsActiveByModel(modelId),
        enabled: !!modelId,
        retry: 0,
    });
    const stockLotOptions =
        stockLotsData?.map((stockLot) => ({
            label: `${stockLot.batch}`,
            value: stockLot.id,
            extra: (
                <span className="text-sm text-gray-500">
                    (Disponible: {stockLot.quantityAvailable})
                </span>
            ),
        })) || [];

    // Mutacion para guardar los cambios
    const { mutate } = useMutation({
        mutationFn: allocateStockInDeliveryLine,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof DeliveryLineAllocateForm, {
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
                queryKey: ["deliveryLines", "deliveryOrder", deliveryOrderId],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "deliveryLine",
                    deliveryLineId ? +deliveryLineId : 0,
                ],
            });
            queryClient.invalidateQueries({
                queryKey: ["deliveryLine", "stockLots", deliveryLineId],
            });

            toast.success(data);
            setAllocateStockModalOpen(false);
        },
    });
    const handleForm = (formData: DeliveryLineAllocateForm) => {
        const data = {
            formData,
            deliveryLineId,
        };
        mutate(data);
    };

    // TOMAR LOS LOTES DE STOCK SELECCIONADOS POR EL USUARIO
    const stockLotsSelected = useWatch({
        control,
        name: "stockLotsIds",
    });

    useEffect(() => {
        sessionStorage.setItem(
            "stockLotsSelected",
            JSON.stringify(stockLotsSelected || []), // RECORDAR QUE ES UN ARREGLO DE NUMEROS
        );
    }, [stockLotsSelected]);

    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form onSubmit={handleSubmit(handleForm)}>
                {stockLotOptions.length ? (
                    <EntityFormLayout.Inputs isCompact>
                        <InputText
                            id="quantity"
                            label="Cantidad enviada"
                            placeholder="Cantidad"
                            type="text"
                            errorMessage={errors.quantity}
                            functionEnabled={register("quantity")}
                        />

                        {/* LISTA DE LOTES DE STOCKS */}
                        {/* SE TIENE QUE ENVIAR UNA LISTA DE ids dentro de un arreglo de numeros */}
                        {
                            <CheckboxGroup<DeliveryLineAllocateForm>
                                name="stockLotsIds"
                                control={control}
                                label="Seleccionar lotes"
                                options={stockLotOptions}
                                errorMessage={
                                    errors.stockLotsIds as
                                        | FieldError
                                        | undefined
                                }
                            />
                        }
                    </EntityFormLayout.Inputs>
                ) : (
                    // TODO: APLICAR UN DISEÑO SIMILAR A LA OTRA VENTANA MODAL QUE SE ENCUENTRA EN TRANSFERSTOCKLOT
                    <div>
                        No se encontrarón lotes de stock para el producto actual
                    </div>
                )}
                <EntityFormLayout.Actions>
                    {stockLotOptions.length !== 0 && (
                        <Button
                            icon={<ArrowUpCircleIcon />}
                            size="large"
                            text="Agregar"
                            type="submit"
                            color="green"
                            showIconOnMobile={false}
                            showTextOnMobile
                            isLargeOnMobile
                            applyMinWidth
                        />
                    )}
                    <Button
                        type="button"
                        icon={<XCircleIcon />}
                        size="large"
                        text="Cancelar"
                        color="gray"
                        onClick={() => setAllocateStockModalOpen(false)}
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
