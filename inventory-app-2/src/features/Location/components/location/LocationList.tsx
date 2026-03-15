import { useQuery } from "@tanstack/react-query"
import { useEffectEvent, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { listAllLocations } from "../../api/LocationAPI"
import { listAllRegions } from "../../api/RegionAPI"
import { listAllSubregionsByRegionId } from "../../api/SubregionAPI"
import type { LocationItem, RegionItem, SubregionItem } from "../../types"
import { useMediaQuery } from "react-responsive"
import { TitleContainer } from "@/components/TitleContainer"
import { ButtonLink } from "@/ui/ButtonLink"
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { FiltersFormContainer } from "@/components/FiltersFormContainer"
import { InputTextFilter } from "@/ui/filters/InputTextFilter"
import { SelectOptionFilter } from "@/ui/filters/SelectOptionFilter"
import { SearchCounter } from "@/components/SearchCounter"
import { TableHeaderContainer } from "@/components/TableHeaderContainer"
import { TableRowContainer } from "@/components/TableRowContainer"
import { BaseTableCell } from "@/components/BaseTableCell"
import { Paginator } from "@/components/Paginator"
import { LocationChangeStatus } from "./LocationChangeStatus"

export const LocationList = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const page = Number(searchParams.get('page') ?? 0)
    const name = searchParams.get('name') ?? ''
    const regionId = searchParams.get('regionId') ?? undefined
    const subregionId = searchParams.get('subregionId') ?? undefined
    const statusParam = searchParams.get('status')
    const status =
        statusParam === null
            ? undefined
            : statusParam === 'true'

    const [form, setForm] = useState({
        page: page,
        name: name,
        regionId: regionId ?? '',
        subregionId: subregionId ?? '',
        status: status === undefined ? '' : String(status),
    })

    useEffectEvent(() => {
        setForm({
            page: page,
            name: name,
            regionId: regionId ?? '',
            subregionId: subregionId ?? '',
            status: status === undefined ? '' : String(status),
        })
    })

    const { data, isError } = useQuery({
        queryKey: ['list-locations', { name, regionId, subregionId, status, page }],

        queryFn: () => listAllLocations({
            page: page,
            name: name,
            regionId: regionId,
            subregionId: subregionId,
            status: status
        }),
    })

    const content = data?.content || []

    const { data: regionsData } = useQuery({
        queryKey: ['list-regions'],
        queryFn: listAllRegions
    })
    const { data: subregionsData } = useQuery({
        queryKey: ['list-subregions-by-region', form.regionId],
        queryFn: () => listAllSubregionsByRegionId(form.regionId!),
        enabled: !!form.regionId // solo ejecuta si hay region
    })

    const regions = regionsData?.map((region: RegionItem) => ({
        value: region.id,
        label: region.name,
    })) || []


    const subregions = subregionsData?.map((type: SubregionItem) => ({
        value: type.id,
        label: type.name,
    })) || []

    const statusOptions = [
        { value: '', label: 'Todos los estados' },
        { value: 'true', label: 'Activos' },
        { value: 'false', label: 'Inactivos' },
    ]
    const isSmallScreen = useMediaQuery({ query: '(max-width: 479px)' })


    return (

        <TitleContainer
            title="Ubicaciones"
            buttons={
                <ButtonLink
                    icon={<PlusCircleIcon />}
                    size="large"
                    text="Nueva ubicación"
                    to="/locations/new"
                    color="blue"
                />
            }
            searchParams={
                <FiltersFormContainer onSubmit={
                    (e) => {
                        e.preventDefault()

                        const params = new URLSearchParams()

                        if (form.name) params.set('name', form.name)
                        if (form.regionId) params.set('regionId', form.regionId)
                        if (form.subregionId) params.set('subregionId', form.subregionId)
                        if (form.status !== '') params.set('status', form.status)

                        setSearchParams(params)
                    }
                }>
                    <InputTextFilter
                        name='name'
                        label='Nombre de la ubicación:'
                        placeholder='Buscar ubicaciones por nombre'
                        type='text'
                        value={form.name}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, name: e.target.value }))
                        }
                    />

                    <div className={`flex ${isSmallScreen ? 'flex-col gap-2' : 'flex-row gap-4'}`}>
                        <SelectOptionFilter
                            name='regionId'
                            label='Región:'
                            options={regions}
                            onChange={(e) =>
                                setForm(prev =>
                                ({
                                    ...prev,
                                    regionId: e.target.value,
                                    subregionId: '' // reset
                                }))
                            }
                            textInNullOption="Todas las regiones"
                            value={form.regionId}
                        />

                        {/* TODO: LUEGO DE SELECCIONAR UNA REGION DEBE LISTAR TODAS LAS SUBREGIONES ASOCIADAS A ESA REGION */}
                        <SelectOptionFilter
                            name='subregionId'
                            label='Subregión:'
                            options={subregions}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, subregionId: e.target.value }))
                            }
                            textInNullOption="Todas las subregiones asociadas"
                            value={form.subregionId}
                        />
                        <SelectOptionFilter
                            name='status'
                            label='Estado:'
                            options={statusOptions}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, status: e.target.value }))
                            }
                            value={form.status}
                        />

                    </div>

                </FiltersFormContainer>
            }
        >
            {
                data && <SearchCounter totalElements={data.totalElements} page={data.page} size={data.size} last={data.last} />
            }

            <TableHeaderContainer
                headers={['ID', 'Nombre', 'Ubicación', 'Subregión', 'Estado', 'Editar']}
                isError={isError}
                isEmpty={!content?.length}
            >
                {
                    content?.map((location: LocationItem) => {
                        return <TableRowContainer key={location.id}>
                            <BaseTableCell data={location.id} />
                            <BaseTableCell data={
                                <div className='flex flex-col gap-1'>
                                    {location.name}
                                </div>
                            } />
                            <BaseTableCell data={
                                location.address
                            } />
                            <BaseTableCell data={
                                location.subregionName
                            } />

                            <BaseTableCell data={
                                <LocationChangeStatus size="small" locationId={location.id.toString()} value={location.status ? 'Activo' : 'Inactivo'} />
                            } />

                            <BaseTableCell isCenter data={
                                location.status === true ?
                                    <ButtonLink
                                        size="small"
                                        text="Editar"
                                        to={`/locations/edit/${location.id}`}
                                        color="blue"

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
                            if (form.regionId) params.set('regionId', form.regionId)
                            if (form.subregionId) params.set('subregionId', form.subregionId)
                            if (form.status !== '') params.set('status', form.status)

                            params.set('page', page.toString())

                            setSearchParams(params)

                        }}
                    />
                ) : null
            }
        </TitleContainer>


    )
}
