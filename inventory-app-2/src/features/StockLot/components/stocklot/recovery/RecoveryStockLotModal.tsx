import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { Button } from "@/ui/Button";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { InputText } from "@/ui/fields/InputText";
import { recoveryStockLot } from "../../../api/StockLotAPI";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import type { StockLotAdjustmentForm } from "@/features/StockLot/schemas/requests";

type Props = {
    stockLotId: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const RecoveryStockLotModal = ({ stockLotId, setShowModal }: Props) => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<StockLotAdjustmentForm>({
        defaultValues: {
            quantity: undefined,
            comment: "",
        },
    });
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: recoveryStockLot,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof StockLotAdjustmentForm, {
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
                queryKey: ["stocklot", stockLotId],
            });
            queryClient.invalidateQueries({ queryKey: ["movements"] });
            toast.success(data);
            setShowModal(false);
        },
    });

    const handleForm = (formData: StockLotAdjustmentForm) => {
        const data = {
            formData,
            stockLotId,
        };
        mutate(data);
    };

    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form onSubmit={handleSubmit(handleForm)}>
                <EntityFormLayout.Inputs isCompact>
                    <InputText
                        id="quantity"
                        label="Unidades a recuperar"
                        placeholder="Cantidad"
                        type="number"
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
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions isCompact>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Recuperar"
                        type="submit"
                        color="green"
                        showIconOnMobile={false}
                        showTextOnMobile
                        isLargeOnMobile
                        applyMinWidth
                    />
                    <Button
                        icon={<XCircleIcon />}
                        size="large"
                        text="Volver"
                        color="gray"
                        type="button"
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
