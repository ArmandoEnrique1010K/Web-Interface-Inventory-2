import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    listAllStockLotsByModelAndExcludeOne,
    transferStockLot,
} from "../../api/StockLotAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { Button } from "@/ui/Button";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { InputText } from "@/ui/fields/InputText";
import type { StockLotDetailsItem, StockLotTransferForm } from "../../types";
import { SelectOption } from "@/ui/fields/SelectOption";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";

type Props = {
    data: StockLotDetailsItem;
    stockLotEmitterId: string;
    showModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TransferStockLotModal = ({
    data,
    stockLotEmitterId,
    showModal,
}: Props) => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<StockLotTransferForm>({
        defaultValues: {
            quantity: "",
            comment: "",
            stockLotReceiverId: "",
        },
    });
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: transferStockLot,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof StockLotTransferForm, {
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
            queryClient.invalidateQueries({ queryKey: ["stocklots"] });
            queryClient.invalidateQueries({
                queryKey: ["stocklot", stockLotEmitterId],
            });
            toast.success(data);
            showModal(false);
        },
    });

    const handleForm = (formData: StockLotTransferForm) => {
        const data = {
            stockLotEmitterId,
            formData,
        };
        mutate(data);
    };

    // OBTENER LOS LOTES DE STOCK CORRESPONDIENTES AL MODELO
    const { data: stockLotsData } = useQuery({
        queryKey: ["stocklots", "model", data.modelId],
        queryFn: () =>
            listAllStockLotsByModelAndExcludeOne(
                stockLotEmitterId,
                data.companyId,
                data.modelId,
            ),
    });
    const stockLotsByModelAndCompany =
        stockLotsData?.map((stockLot: StockLotDetailsItem) => ({
            value: stockLot.id,
            label: stockLot.batch,
        })) || [];

    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form onSubmit={handleSubmit(handleForm)}>
                {stockLotsByModelAndCompany.length === 0 ? (
                    <>
                        <EntityFormLayout.Header helpText="No se ha encontrado otro lote de stock que pertenezca al mismo modelo y a la misma empresa importadora del producto seleccionado"></EntityFormLayout.Header>
                    </>
                ) : (
                    <EntityFormLayout.Inputs isCompact>
                        <InputText
                            id="quantity"
                            label="Unidades a transferir"
                            placeholder="Cantidad"
                            type="text"
                            errorMessage={errors.quantity}
                            functionEnabled={register("quantity")}
                        />

                        <InputText
                            id="comment"
                            label="Comentario breve"
                            placeholder="Comentario..."
                            type="text"
                            errorMessage={errors.comment}
                            functionEnabled={register("comment")}
                        />

                        {/* TODO: PODRIA SER MÁS INTUITIVO */}
                        {/* OBTENER LOS LOTES DE STOCK CUYO MODELO SEA EL MISMO DEL STOCK LOT EMITTER */}

                        <SelectOption
                            id="stockLotReceiverId"
                            label="Lote de stock receptor"
                            errorMessage={errors.stockLotReceiverId}
                            functionEnabled={register("stockLotReceiverId")}
                            options={stockLotsByModelAndCompany}
                            textInNullOption="Seleccione un código del lote de stock receptor"
                        />
                    </EntityFormLayout.Inputs>
                )}
                <EntityFormLayout.Actions isCompact>
                    {stockLotsByModelAndCompany.length !== 0 && (
                        <Button
                            icon={<ArrowUpCircleIcon />}
                            size="large"
                            text="Transferir"
                            type="submit"
                            color="green"
                            showIconOnMobile={false}
                            showTextOnMobile
                            isLargeOnMobile
                            applyMinWidth
                        />
                    )}
                    <Button
                        icon={<XCircleIcon />}
                        size="large"
                        text="Volver"
                        color="gray"
                        type="button"
                        onClick={() => showModal(false)}
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
