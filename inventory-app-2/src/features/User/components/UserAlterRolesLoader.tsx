import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import type { UserRolesDetails } from "../types";
import { getUserRoles } from "../api/UserAPI";
import { TextMessage } from "@/components/TextMessage";
import { UserAlterRolesForm } from "./UserAlterRolesForm";

export const UserAlterRolesLoader = () => {
    const params = useParams();
    const userId = params.id!;

    const { data, isLoading, isError } = useQuery<UserRolesDetails>({
        queryKey: ['edit-roles', userId],
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
        <UserAlterRolesForm data={data} userId={userId} />
    )
}
