import { useQuery } from "@tanstack/react-query"
import { getUserProfilePage } from "../api/ProfileAPI";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { PanelContainer } from "@/components/containers/PanelContainer";
import type { UserDetailsItem } from "@/features/User/types";
import { handleApplyRoleStyle } from "@/utils/handleApplyRoleStyle";
import { ButtonLink } from "@/ui/ButtonLink";
import { UserIcon } from "@heroicons/react/24/outline";


export const UserProfilePage = () => {
    const { data, isLoading } = useQuery<UserDetailsItem>({
        queryKey: ['profile'],
        queryFn: getUserProfilePage
    })


    if (isLoading) {
        return <h1>Cargando...</h1>
    }

    return (
        <EntityDetailsLayout>
            <EntityDetailsLayout.Header
                title={"Perfil del usuario"}
                actions={
                    <>
                        <ButtonLink
                            icon={<UserIcon />}
                            to={'/profile/update'}
                            size={"large"}
                            text={"Actualizar Perfil"}
                            color={"blue"}
                            showIconOnMobile={false}
                            showTextOnMobile

                        />

                    </>
                }
            ></EntityDetailsLayout.Header>

            <EntityDetailsLayout.Content columns={1}>
                <EntityDetailsLayout.Column>
                    <PanelContainer>
                        <PanelContainer.DetailsGrid>
                            {
                                data && (
                                    <>
                                        <PanelContainer.Detail label="Nombres">
                                            {data.firstname}
                                        </PanelContainer.Detail>
                                        <PanelContainer.Detail label="Apellidos">
                                            {data.lastname}
                                        </PanelContainer.Detail>
                                        <PanelContainer.Detail label="DNI">
                                            {data.dni}
                                        </PanelContainer.Detail>
                                        <PanelContainer.Detail label="Correo">
                                            {/** El correo del usuario puede ser muy largo, es por ello que se acorta */}
                                            <span className="truncate block">{data.email}</span>
                                        </PanelContainer.Detail>
                                        <PanelContainer.Detail label="Roles">
                                            <span className="flex flex-wrap gap-2 text-sm">
                                                {
                                                    data.roles.map(role => (
                                                        <span key={role} className={`px-3 py-1 rounded-4xl ${handleApplyRoleStyle(role as 'Usuario' | 'Operador' | 'Secretario' | 'Administrador')}`}>{role}</span>
                                                    ))
                                                }
                                            </span>
                                        </PanelContainer.Detail>

                                    </>
                                )
                            }

                        </PanelContainer.DetailsGrid>

                    </PanelContainer>
                </EntityDetailsLayout.Column>
            </EntityDetailsLayout.Content>
        </EntityDetailsLayout>

    )
}
