import { useQuery } from "@tanstack/react-query";
import { getUserProfilePage } from "../api/ProfileAPI";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import { PanelContainer } from "@/components/containers/PanelContainer";
import { ButtonLink } from "@/ui/ButtonLink";
import { UserIcon } from "@heroicons/react/24/outline";
import { LoadingView } from "@/views/LoadingView";
import { Error } from "@/views/Error";
import { handleApplyRoleStyle } from "@/utils/handleApplyRoleStyle";
import { formatRole } from "../../../utils/formatRole";

export const UserProfilePage = () => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: getUserProfilePage,
    });

    if (isLoading) {
        return <LoadingView />;
    }
    if (isError) {
        return <Error type="500" />;
    }
    if (!data) {
        return <Error type="404" />;
    }

    return (
        <EntityDetailsLayout>
            <EntityDetailsLayout.Header
                title={"Perfil del usuario"}
                actions={
                    <ButtonLink
                        icon={<UserIcon />}
                        to={"/profile/update"}
                        size={"large"}
                        text={"Actualizar Perfil"}
                        color={"blue"}
                        showIconOnMobile={false}
                        showTextOnMobile
                    />
                }
            ></EntityDetailsLayout.Header>

            <EntityDetailsLayout.Content columns={1}>
                <EntityDetailsLayout.Column>
                    <PanelContainer>
                        <PanelContainer.DetailsGrid>
                            {data && (
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
                                        <span className="truncate block">
                                            {data.email}
                                        </span>
                                    </PanelContainer.Detail>
                                    <PanelContainer.Detail label="Rol">
                                        <span className="flex flex-wrap gap-2 text-sm">
                                            <span
                                                className={`px-3 py-1 rounded-4xl ${handleApplyRoleStyle(data.role)}`}
                                            >
                                                {formatRole(data.role)}
                                            </span>
                                        </span>
                                    </PanelContainer.Detail>
                                </>
                            )}
                        </PanelContainer.DetailsGrid>
                    </PanelContainer>
                </EntityDetailsLayout.Column>
            </EntityDetailsLayout.Content>
        </EntityDetailsLayout>
    );
};
