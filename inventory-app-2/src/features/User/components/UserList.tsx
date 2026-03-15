import { useQuery } from "@tanstack/react-query"
import { useEffectEvent, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { listAllUsers } from "../api/UserAPI"
import { listAllRoles } from "../api/RoleAPI"
import type { RoleItem, UserItem } from "../types"
import { useMediaQuery } from "react-responsive"
import { TitleContainer } from "@/components/TitleContainer"
import { FiltersFormContainer } from "@/components/FiltersFormContainer"
import { InputTextFilter } from "@/ui/filters/InputTextFilter"
import { SearchCounter } from "@/components/SearchCounter"
import { TableHeaderContainer } from "@/components/TableHeaderContainer"
import { SelectCheckboxFilter } from "@/ui/filters/SelectCheckboxFilter"
import { TableRowContainer } from "@/components/TableRowContainer"
import { BaseTableCell } from "@/components/BaseTableCell"
import { ButtonLink } from "@/ui/ButtonLink"
import { Paginator } from "@/components/Paginator"
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { UserChangeStatus } from "./UserChangeStatus"

export const UserList = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const page = Number(searchParams.get('page') ?? 0)
    const name = searchParams.get('name') ?? ''
    // IdRoles es una lista de numeros List<Long>
    const idRolesParam = searchParams.get('idRoles') ?? ''
    const idRoles = idRolesParam ? idRolesParam.split(',').map(Number).filter(n => !isNaN(n)) : []

    const [form, setForm] = useState({
        page: page,
        name: name,
        idRoles: idRoles,
    })
    useEffectEvent(() => {
        setForm({
            page: page,
            name: name,
            idRoles: idRoles,
        })
    })

    const { data, isError } = useQuery({
        queryKey: ['list-users', { name, idRoles, page }],

        queryFn: () => listAllUsers({
            page: page,
            name: name,
            idRoles: idRoles,
        }),
    })

    const content = data?.content || []

    const { data: rolesData } = useQuery({
        queryKey: ['list-roles'],
        queryFn: listAllRoles
    })

    const roles = rolesData?.map((role: RoleItem) => ({
        value: role.id.toString(),
        label: role.label,
    })) || []

    const isSmallScreen = useMediaQuery({ query: '(max-width: 479px)' })

    return (
        <TitleContainer
            title="Usuarios registrados"
            buttons={
                <ButtonLink
                    icon={<PlusCircleIcon />}
                    size="large"
                    text="Registrar usuario"
                    to="/users/new"
                    color="blue"
                />
            }
            searchParams={
                <FiltersFormContainer onSubmit={
                    (e) => {
                        e.preventDefault()

                        const params = new URLSearchParams()

                        if (form.name) params.set('name', form.name)
                        // if (form.idRoles) params.set('idRoles', form.idRoles.toString())


                        // Se corrige el problema de la URL en la que se reemplaza las comas (,)
                        // Resultado: http://localhost:5173/users?idRoles=4&idRoles=3
                        if (form.idRoles) form.idRoles.forEach(role => params.append('idRoles', role.toString()))

                        setSearchParams(params)
                    }
                }>
                    <div>
                        <InputTextFilter
                            name='name'
                            label='Palabra clave:'
                            placeholder='Buscar usuarios por nombre, apellido, email y/o dni'
                            type='text'
                            value={form.name}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, name: e.target.value }))
                            }
                        />
                    </div>
                    <div className={`flex ${isSmallScreen ? 'flex-col gap-2' : 'flex-row gap-4'}`}>
                        <SelectCheckboxFilter
                            name='idRoles'
                            label='Roles:'
                            options={roles}
                            onChange={(selectedValues) =>
                                setForm(prev => ({ ...prev, idRoles: selectedValues.map(Number) }))
                            }
                            value={form.idRoles.map(String)}  // Convert numbers to strings
                        />
                    </div>

                </FiltersFormContainer>
            }
        >
            {
                data && <SearchCounter totalElements={data.totalElements} page={data.page} size={data.size} last={data.last} />
            }

            <TableHeaderContainer
                headers={['ID', 'Nombres', 'DNI', 'Roles', 'Estado', 'Alterar roles']}
                isError={isError}
                isEmpty={!content?.length}
            >
                {
                    content?.map((user: UserItem) => {
                        return <TableRowContainer key={user.id}>
                            <BaseTableCell data={user.id} />
                            <BaseTableCell data={
                                <div className='flex flex-col gap-1'>
                                    {user.firstname} {user.lastname}
                                </div>
                            } />
                            <BaseTableCell data={user.dni} />
                            <BaseTableCell data={user.roles.map(r => r + " ")} />
                            <BaseTableCell data={
                                <UserChangeStatus userId={user.id.toString()} value={user.status === true ? 'Activo' : 'Inactivo'} size={"small"} />
                            } />

                            <BaseTableCell isCenter data={
                                user.status === true ?
                                    <ButtonLink
                                        size="small"
                                        text="Alterar roles"
                                        to={`/users/${user.id}/alter`}
                                        color="red"
                                    /> : ''
                            } />

                        </TableRowContainer>
                    })
                }
            </TableHeaderContainer>

            {
                (content?.length && data) ? (
                    <Paginator
                        currentPage={data?.page}
                        totalPages={data?.totalPages}
                        isFirst={data?.first}
                        isLast={data?.last}
                        onPageChange={(page) => {
                            setForm(prev => ({
                                ...prev,
                                page
                            }))
                            const params = new URLSearchParams()


                            if (form.name) params.set('name', form.name)
                            // if (form.idRoles) params.set('idRoles', form.idRoles.toString())
                            if (form.idRoles) params.getAll('idRoles')
                            params.set('page', page.toString())

                            setSearchParams(params)

                        }}
                    />
                ) : null
            }
        </TitleContainer>
    )
}
