import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { changeLimitDateDeliveryOrder } from "../../../api/DeliveryOrderAPI";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import { InputDateTime } from "@/ui/fields/InputDateTime";
import { Button } from "@/ui/Button";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { handleFormatDateTime } from "@/utils/handleFormatDateTime";
import type { DeliveryOrderChangeLimitDateForm } from "../../../schemas/requests";
import { useAuthRole } from "@/hooks/useAuthRole";

type Props = {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    deliveryOrderId: number;
};

export const ChangeLimitDateModal = ({
    setShowModal,
    deliveryOrderId,
}: Props) => {
    const { userRole } = useAuthRole();

    const initialValues = {
        limitDate: "",
    };

    const {
        handleSubmit,
        setError,
        control,
        formState: { errors },
    } = useForm<DeliveryOrderChangeLimitDateForm>({
        defaultValues: initialValues,
    });
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: (data: DeliveryOrderChangeLimitDateForm) => {
            if (!data.limitDate) {
                return changeLimitDateDeliveryOrder(deliveryOrderId, {
                    limitDate: "",
                });
            }

            return changeLimitDateDeliveryOrder(deliveryOrderId, {
                limitDate: handleFormatDateTime(new Date(data.limitDate)),
            });
        },
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof DeliveryOrderChangeLimitDateForm, {
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
            queryClient.invalidateQueries({
                queryKey: ["deliveryOrder", deliveryOrderId],
            });
            queryClient.invalidateQueries({
                queryKey: ["dashboard", userRole],
            });
        },
    });

    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form
                styled={false}
                onSubmit={handleSubmit((data) => {
                    mutate(data);
                })}
            >
                <EntityFormLayout.Inputs isCompact>
                    <InputDateTime<DeliveryOrderChangeLimitDateForm>
                        id="limitDate"
                        label="Nueva fecha limite de entrega"
                        name={"limitDate"}
                        control={control}
                        errorMessage={errors.limitDate?.message}
                    />
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Cambiar"
                        type="submit"
                        color="green"
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
