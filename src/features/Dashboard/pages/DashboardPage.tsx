import { ROLE_ADMIN, ROLE_OPERATOR, ROLE_USER } from "@/constants";
import { useAuthRole } from "@/hooks/useAuthRole";
import { useQuery } from "@tanstack/react-query";
import {
    getDashboardAdmin,
    getDashboardOperator,
    getDashboardUser,
} from "../api/DashboardAPI";
import { EntityDetailsLayout } from "@/layout/entity/EntityDetailsLayout";
import type {
    AdminDashboardItem,
    OperatorDashboardItem,
    UserDashboardItem,
} from "../schemas/items";
import { PanelContainer } from "@/components/containers/PanelContainer";
import { LoadingView } from "@/views/LoadingView";
import { Error } from "@/views/Error";
import { UserDashboard } from "../views/UserDashboard";
import { OperatorDashboard } from "../views/OperatorDashboard";
import { AdminDashboard } from "../views/AdminDashboard";

export const DashboardPage = () => {
    const { hasPermission, userRole } = useAuthRole();

    const { data, isLoading, isError } = useQuery<
        UserDashboardItem | OperatorDashboardItem | AdminDashboardItem
    >({
        queryKey: ["dashboard", userRole],
        queryFn: () => {
            if (hasPermission(ROLE_ADMIN)) {
                return getDashboardAdmin();
            } else if (hasPermission(ROLE_OPERATOR)) {
                return getDashboardOperator();
            } else {
                return getDashboardUser();
            }
        },
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
            <EntityDetailsLayout.Content columns={1}>
                <EntityDetailsLayout.Column>
                    <PanelContainer>
                        <div className="text-center sm:text-4xl text-2xl font-bold">
                            Bienvenido {data.userFullname}
                        </div>
                    </PanelContainer>

                    {userRole === ROLE_USER && (
                        <UserDashboard
                            data={data as UserDashboardItem}
                            isError={isError}
                            isLoading={isLoading}
                        />
                    )}

                    {userRole === ROLE_OPERATOR && (
                        <OperatorDashboard
                            data={data as OperatorDashboardItem}
                            isError={isError}
                            isLoading={isLoading}
                        />
                    )}

                    {userRole === ROLE_ADMIN && (
                        <AdminDashboard
                            data={data as AdminDashboardItem}
                            isError={isError}
                            isLoading={isLoading}
                        />
                    )}
                </EntityDetailsLayout.Column>
            </EntityDetailsLayout.Content>
            {/* {JSON.stringify(data, null, 2)} */}
        </EntityDetailsLayout>
    );
};
