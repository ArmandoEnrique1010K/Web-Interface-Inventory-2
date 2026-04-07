import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { cancelDeliveryOrder } from "../../../api/DeliveryOrderAPI";
import { EntityFormLayout } from "@/layout/entity/EntityFormLayout";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/ui/Button";
import { InputText } from "@/ui/fields/InputText";
import { useNavigate } from "react-router-dom";
import type { DeliveryOrderCommentForm } from "../../../schemas/requests";

type Props = {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    deliveryOrderId: number;
};

export const CancelDeliveryOrderModal = ({
    deliveryOrderId,
    setShowModal,
}: Props) => {
    const initialValues = {
        movementComment: "",
    };

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<DeliveryOrderCommentForm>({
        defaultValues: initialValues,
    });

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Mutacion para guardar los cambios
    const { mutate } = useMutation({
        mutationFn: cancelDeliveryOrder,
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "FIELD_ERROR" && e.fields) {
                Object.entries(e.fields).forEach(([field, message]) => {
                    setError(field as keyof DeliveryOrderCommentForm, {
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
            queryClient.removeQueries({
                queryKey: ["deliveryOrder", deliveryOrderId],
            });
            queryClient.invalidateQueries({ queryKey: ["movements"] });
            toast.success(data);
            setShowModal(false);
            navigate(`/orders`);
        },
    });
    const handleForm = (formData: DeliveryOrderCommentForm) => {
        const data = {
            formData,
            deliveryOrderId,
        };
        mutate(data);
    };

    return (
        <EntityFormLayout isCompact>
            <EntityFormLayout.Form
                styled={false}
                onSubmit={handleSubmit(handleForm)}
            >
                <EntityFormLayout.Inputs isCompact>
                    <InputText
                        id="movementComment"
                        label="Comentario"
                        type="text"
                        placeholder="Escriba un comentario"
                        errorMessage={errors.movementComment}
                        functionEnabled={register("movementComment")}
                    />
                </EntityFormLayout.Inputs>
                <EntityFormLayout.Actions>
                    <Button
                        icon={<ArrowUpCircleIcon />}
                        size="large"
                        text="Cancelar orden"
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
                        text="No cancelar"
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
