import type { GeneralError } from "@/types/index";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { changeStatusType } from "../../api/TypeAPI";
import { Button } from "@/ui/Button";

type Props = {
    typeId: number;
    status: boolean;
};

export const StatusTypeButton = ({ typeId, status }: Props) => {
    const { handleSubmit } = useForm();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: () => changeStatusType(typeId),
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "GENERAL_ERROR") {
                toast.error(e.message);
                return;
            }
        },

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["types"] });
            toast.success(data);
        },
    });

    return (
        <form onSubmit={handleSubmit(() => mutate())}>
            <Button
                text={status ? "Activo" : "Inactivo"}
                type="submit"
                size={"small"}
                color={status ? "green-outline" : "red-outline"}
                showIconOnMobile={false}
                showTextOnMobile={true}
                isLargeOnMobile={false}
            />
        </form>
    );
};
