import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listAllUsers } from "../api/UserAPI";
import { listAllRoles } from "../api/RoleAPI";
import { FiltersFormContainer } from "@/components/FiltersFormContainer";
import { InputTextFilter } from "@/ui/filters/InputTextFilter";
import { SearchCounter } from "@/components/SearchCounter";
import { TableContainer } from "@/components/TableContainer";
import { SelectCheckboxGroupFilter } from "@/ui/filters/SelectCheckboxGroupFilter";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";
import { ButtonLink } from "@/ui/ButtonLink";
import { Paginator } from "@/components/Paginator";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { StatusUserButton } from "../components/StatusUserButton";
import { EntityListLayout } from "@/layout/entity/EntityListLayout";
import { handleApplyRoleStyle } from "@/utils/handleApplyRoleStyle";
import { AlterRolesUserButton } from "../components/AlterRolesUserButton";

export const ListUserPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page") ?? 0);
    const name = searchParams.get("name") ?? "";
    // IdRoles es una lista de numeros List<Long>
    // const idRolesParam = searchParams.get("idRoles") ?? "";
    // const idRoles = idRolesParam
    //     ? idRolesParam
    //           .split(",")
    //           .map(Number)
    //           .filter((n) => !isNaN(n))
    //     : [];

    const idRoles = searchParams
        .getAll("idRoles")
        .map(Number)
        .filter((n) => !isNaN(n));

    const [form, setForm] = useState({
        page: page,
        name: name,
        idRoles: idRoles,
    });
    // useEffectEvent(() => {
    //     setForm({
    //         page: page,
    //         name: name,
    //         idRoles: idRoles,
    //     });
    // });

    const { data, isError, isLoading } = useQuery({
        queryKey: ["users", { name, idRoles, page }],

        queryFn: () =>
            listAllUsers({
                page: page,
                name: name,
                idRoles: idRoles,
            }),
    });

    const content = data?.content || [];

    const { data: rolesData } = useQuery({
        queryKey: ["roles"],
        queryFn: listAllRoles,
    });

    const roles =
        rolesData?.map((role) => ({
            value: role.id.toString(),
            label: role.label,
        })) || [];

    return (
        <EntityListLayout>
            <EntityListLayout.Header
                title="Usuarios registrados"
                actions={
                    <ButtonLink
                        icon={<PlusCircleIcon />}
                        size="large"
                        text="Registrar usuario"
                        to="/users/new"
                        color="blue"
                        showIconOnMobile={false}
                        showTextOnMobile
                    />
                }
            ></EntityListLayout.Header>
            <EntityListLayout.Content>
                <FiltersFormContainer
                    onSubmit={(e) => {
                        e.preventDefault();

                        const params = new URLSearchParams();

                        if (form.name) params.set("name", form.name);
                        // if (form.idRoles) params.set('idRoles', form.idRoles.toString())

                        // Se corrige el problema de la URL en la que se reemplaza las comas (,)
                        // Resultado: http://localhost:5173/users?idRoles=4&idRoles=3

                        console.log(form.idRoles);

                        if (form.idRoles)
                            form.idRoles.forEach((role) =>
                                params.append("idRoles", role.toString()),
                            );

                        setSearchParams(params);
                    }}
                >
                    <InputTextFilter
                        name="name"
                        label="Palabra clave"
                        placeholder="Buscar usuarios por nombre, apellido, email y/o dni"
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                    />

                    {rolesData && (
                        <SelectCheckboxGroupFilter
                            name="idRoles"
                            label="Roles"
                            options={roles}
                            onChange={(selectedValues) =>
                                setForm((prev) => ({
                                    ...prev,
                                    idRoles: selectedValues.map(Number),
                                }))
                            }
                            value={form.idRoles.map(String)} // Convierte numeros a string
                        />
                    )}
                </FiltersFormContainer>
                <TableContainer
                    headers={[
                        "ID",
                        "Nombres",
                        "DNI",
                        "Roles",
                        "Estado",
                        "Alterar roles",
                    ]}
                    isLoading={isLoading}
                    isError={isError}
                    isEmpty={!content?.length}
                    itemsCounter={
                        data && (
                            <SearchCounter
                                totalElements={data.totalElements}
                                page={data.page}
                                size={data.size}
                                last={data.last}
                            />
                        )
                    }
                    paginator={
                        content?.length && data ? (
                            <Paginator
                                currentPage={data?.page}
                                totalPages={data?.totalPages}
                                isFirst={data?.first}
                                isLast={data?.last}
                                onPageChange={(page) => {
                                    setForm((prev) => ({
                                        ...prev,
                                        page,
                                    }));
                                    const params = new URLSearchParams();

                                    if (form.name)
                                        params.set("name", form.name);
                                    // if (form.idRoles) params.set('idRoles', form.idRoles.toString())
                                    if (form.idRoles) params.getAll("idRoles");
                                    params.set("page", page.toString());

                                    setSearchParams(params);
                                }}
                            />
                        ) : null
                    }
                >
                    {content?.map((user) => {
                        return (
                            <TableRowContainer key={user.id}>
                                <BaseTableCell data={user.id} />
                                <BaseTableCell
                                    data={
                                        <div className="flex flex-col gap-1">
                                            {user.firstname} {user.lastname}
                                        </div>
                                    }
                                />
                                <BaseTableCell data={user.dni} />
                                <BaseTableCell
                                    data={
                                        <span className="flex flex-wrap gap-2 text-sm">
                                            {user.roles.map((role) => (
                                                <span
                                                    key={role}
                                                    className={`px-3 py-1 rounded-4xl ${handleApplyRoleStyle(role)}`}
                                                >
                                                    {role}
                                                </span>
                                            ))}
                                        </span>
                                    }
                                />
                                <BaseTableCell
                                    data={
                                        <StatusUserButton
                                            userId={user.id}
                                            userStatus={user.status}
                                        />
                                    }
                                />
                                <BaseTableCell
                                    isCenter
                                    data={
                                        user.status === true && (
                                            <AlterRolesUserButton
                                                userId={user.id}
                                            />
                                        )
                                    }
                                />
                            </TableRowContainer>
                        );
                    })}
                </TableContainer>
            </EntityListLayout.Content>
        </EntityListLayout>
    );
};
