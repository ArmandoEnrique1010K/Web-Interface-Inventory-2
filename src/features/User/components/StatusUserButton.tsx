import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { Button } from "@/ui/Button";
import { useForm } from "react-hook-form";
import { changeStatusUser } from "../api/UserAPI";

export const StatusUserButton = ({
    userId,
    userStatus,
}: {
    userId: number;
    userStatus: boolean;
}) => {
    const { handleSubmit } = useForm();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: () => changeStatusUser(userId),
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
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["user", userId] });
        },
    });

    return (
        <form onSubmit={handleSubmit(() => mutate())} className="text-center ">
            <Button
                text={userStatus ? "Concedido" : "Bloqueado"}
                type="submit"
                size={"small"}
                color={userStatus ? "green-outline" : "red-outline"}
                showTextOnMobile
            />
        </form>
    );
};
