import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { Button } from "@/ui/Button";
import { useForm } from "react-hook-form";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { changeStatusModel } from "../../api/ModelAPI";
import { useNavigate } from "react-router-dom";
import { useAuthRole } from "@/hooks/useAuthRole";

export const StatusModelButton = ({
    from,
    modelId,
    productId,
    value,
    size,
}: {
    from?: string;
    modelId: number;
    productId: number;
    value: string;
    size: "small" | "large";
}) => {
    const { handleSubmit } = useForm();
    const queryClient = useQueryClient();
    const { userRole } = useAuthRole();

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: () => changeStatusModel(modelId),
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "GENERAL_ERROR") {
                toast.error(e.message);
                return;
            }
        },

        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ["product", productId] });
            queryClient.invalidateQueries({
                queryKey: ["models", "product", productId],
            });
            queryClient.invalidateQueries({ queryKey: ["models"] });
            queryClient.invalidateQueries({
                queryKey: ["model", modelId ? +modelId : 0],
            });
            queryClient.invalidateQueries({
                queryKey: ["dashboard", userRole],
            });

            if (from === "model-details") {
                navigate("/products/models");
            }
        },
    });

    return (
        <form onSubmit={handleSubmit(() => mutate())}>
            <Button
                icon={size === "large" && <XMarkIcon />}
                text={value}
                type="submit"
                size={size}
                color={value === "Activo" ? "green-outline" : "red-outline"}
                showTextOnMobile
            />
        </form>
    );
};
