import { useQuery } from "@tanstack/react-query";
import type { UserRolesDetails } from "../types";
import { getUserRoles } from "../api/UserAPI";
import { TextMessage } from "@/components/TextMessage";
import { AlterRolesUserModal } from "./AlterRolesUserModal";

type Props = {
    userId: string,
    showModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoaderUser = ({ userId, showModal }: Props) => {

    const { data, isLoading, isError } = useQuery<UserRolesDetails>({
        queryKey: ['roles', userId],
        queryFn: () => getUserRoles(userId),
        retry: false,
    })


    if (isLoading) {
        return <TextMessage text='Cargando...' align='left' color='black' />
    }

    if (isError) {
        return <TextMessage text='Ha ocurrido un error' align='left' color='red' />
    }

    if (data) return (
        <AlterRolesUserModal data={data} userId={userId} showModal={showModal} />
    )
}
