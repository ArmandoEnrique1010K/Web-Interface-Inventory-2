import { useQuery } from '@tanstack/react-query'
import { useEffectEvent, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { listAllStockLots } from '../../api/StockLotAPI'
import { listAllCategories } from '@/features/Product/api/CategoryAPI'
import { listAllTypes } from '@/features/Product/api/TypeAPI'
import { listAllCompanies } from '../../api/CompanyAPI'
import type { CategoryItem, TypeItem } from '@/features/Product/types'
import type { CompanyItem, StockLotItem } from '../../types'
import { useMediaQuery } from 'react-responsive'
import { ButtonLink } from '@/ui/ButtonLink'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { FiltersFormContainer } from '@/components/FiltersFormContainer'
import { InputTextFilter } from '@/ui/filters/InputTextFilter'
import { SelectOptionFilter } from '@/ui/filters/SelectOptionFilter'
import { SearchCounter } from '@/components/SearchCounter'
import { TableContainer } from '@/components/TableContainer'
import { TableRowContainer } from '@/components/TableRowContainer'
import { BaseTableCell } from '@/components/BaseTableCell'
import { Paginator } from '@/components/Paginator'
import { handleFormatDate } from '@/utils/handleFormatDate'
import { EntityListLayout } from '@/layout/entity/EntityListLayout'
import { Button } from '@/ui/Button'
import { Modal } from '@/components/Modal'
import { IncreaseStockLotModal } from '../../components/stocklot/IncreaseStockLotModal'
import { DecreaseStockLotModal } from '../../components/stocklot/DecreaseStockLotModal'
import { RecoveryStockLotModal } from '../../components/stocklot/RecoveryStockLotModal'
import { LoaderTransferStockLot } from '../../components/stocklot/LoaderTransferStockLot'

export const ListStockLotPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const page = Number(searchParams.get('page') ?? 0)
    const minQuantityReceived = searchParams.get('minQuantityReceived') ?? ''
    const maxQuantityReceived = searchParams.get('maxQuantityReceived') ?? ''
    const minQuantityAvailable = searchParams.get('minQuantityAvailable') ?? ''
    const maxQuantityAvailable = searchParams.get('maxQuantityAvailable') ?? ''
    const minCreatedAt = searchParams.get('minCreatedAt') ?? ''
    const maxCreatedAt = searchParams.get('maxCreatedAt') ?? ''
    const keyword = searchParams.get('keyword') ?? ''

    const companyId = searchParams.get('companyId') ?? undefined
    const categoryId = searchParams.get('categoryId') ?? undefined
    const typeId = searchParams.get('typeId') ?? undefined
    const modelId = searchParams.get('modelId') ?? undefined

    const [form, setForm] = useState({
        page: page,
        keyword: keyword,
        minQuantityReceived: minQuantityReceived,
        maxQuantityReceived: maxQuantityReceived,
        minQuantityAvailable: minQuantityAvailable,
        maxQuantityAvailable: maxQuantityAvailable,
        minCreatedAt: minCreatedAt,
        maxCreatedAt: maxCreatedAt,
        companyId: companyId ?? '',
        categoryId: categoryId ?? '',
        typeId: typeId ?? '',
        modelId: modelId ?? ''
    })

    useEffectEvent(() => {
        setForm({
            page: page,
            keyword: keyword,

            minQuantityReceived: minQuantityReceived,
            maxQuantityReceived: maxQuantityReceived,
            minQuantityAvailable: minQuantityAvailable,
            maxQuantityAvailable: maxQuantityAvailable,
            minCreatedAt: minCreatedAt,
            maxCreatedAt: maxCreatedAt,
            companyId: companyId ?? '',
            categoryId: categoryId ?? '',
            typeId: typeId ?? '',
            modelId: modelId ?? ''
        })
    })

    const { data, isError } = useQuery({
        queryKey: ['stocklots', {
            minQuantityReceived, maxQuantityReceived, minQuantityAvailable, maxQuantityAvailable,
            minCreatedAt, maxCreatedAt, keyword, companyId, categoryId, typeId, modelId, page
        }],

        queryFn: () => listAllStockLots({
            page,
            minQuantityReceived,
            maxQuantityReceived,
            minQuantityAvailable,
            maxQuantityAvailable,
            minCreatedAt,
            maxCreatedAt,
            keyword,
            companyId,
            categoryId,
            typeId,
            modelId
        })
    })

    const content = data?.content || []

    // OBTENER LAS EMPRESAS IMPORTADORAS, CATEGORIAS, TIPOS Y MODELOS
    const { data: companyData } = useQuery({
        queryKey: ['companies'],
        queryFn: listAllCompanies,
    })

    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: listAllCategories
    })

    const { data: typesData } = useQuery({
        queryKey: ['types'],
        queryFn: listAllTypes
    })

    //* PARA EL ID DEL MODELO, EL USUARIO TENDRA QUE INTRODUCIRLO MANUALMENTE

    const companies = companyData?.map((company: CompanyItem) => ({
        value: company.id,
        label: company.name,
    })) || []

    const categories = categoriesData?.map((category: CategoryItem) => ({
        value: category.id,
        label: category.name,
    })) || []


    const types = typesData?.map((type: TypeItem) => ({
        value: type.id,
        label: type.name,
    })) || []

    const isSmallScreen = useMediaQuery({ query: '(max-width: 920px)' })
    const isExtraSmallScreen = useMediaQuery({ query: '(max-width: 720px)' })

    const [increaseModalOpen, setIncreaseModalOpen] = useState(false);
    const [decreaseModalOpen, setDecreaseModalOpen] = useState(false);
    const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);
    const [transferModalOpen, setTransferModalOpen] = useState(false);
    const [selectedStockLot, setSelectedStockLot] = useState('');

    return (
        <EntityListLayout>

            <EntityListLayout.Header
                title="Lotes de entrega"
                actions={
                    <ButtonLink
                        icon={<PlusCircleIcon />}
                        size="large"
                        text="Nuevo lote de stock"
                        to="/stocklots/new"
                        color="blue"
                        showIconOnMobile={false}
                        showTextOnMobile
                    />
                }></EntityListLayout.Header>
            <EntityListLayout.Content>
                <FiltersFormContainer onSubmit={
                    (e) => {
                        e.preventDefault()

                        const params = new URLSearchParams()
                        if (form.minQuantityReceived) params.set('minQuantityReceived', form.minQuantityReceived)
                        if (form.maxQuantityReceived) params.set('maxQuantityReceived', form.maxQuantityReceived)
                        if (form.minQuantityAvailable) params.set('minQuantityAvailable', form.minQuantityAvailable)
                        if (form.maxQuantityAvailable) params.set('maxQuantityAvailable', form.maxQuantityAvailable)
                        if (form.minCreatedAt) params.set('minCreatedAt', form.minCreatedAt)
                        if (form.maxCreatedAt) params.set('maxCreatedAt', form.maxCreatedAt)
                        if (form.keyword) params.set('keyword', form.keyword)
                        if (form.companyId) params.set('companyId', form.companyId)
                        if (form.categoryId) params.set('categoryId', form.categoryId)
                        if (form.typeId) params.set('typeId', form.typeId)
                        if (form.modelId) params.set('modelId', form.modelId)
                        setSearchParams(params)
                    }
                }>
                    <InputTextFilter
                        name='keyword'
                        label='Nombre del producto o modelo:'
                        placeholder='Buscar lotes de stock por nombre de producto y/o modelo'
                        type='text'
                        value={form.keyword}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, keyword: e.target.value }))
                        }
                    />

                    <InputTextFilter
                        name='modelId'
                        label='ID del modelo:'
                        placeholder='Introduzca el ID númerico asociado al modelo'
                        type='text'
                        value={form.modelId}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, modelId: e.target.value }))
                        }
                    />
                    <div className={`flex ${isExtraSmallScreen ? 'flex-col gap-4' : 'flex-row gap-4'}`}>
                        <div className='flex-row w-full'>
                            <InputTextFilter
                                name='minQuantityAvailable'
                                label='Cantidad minima disponible:'
                                placeholder='Cantidad minima disponible'
                                type='number'
                                value={form.minQuantityAvailable.toString()}
                                onChange={(e) =>
                                    setForm(prev => ({ ...prev, minQuantityAvailable: e.target.value }))
                                }
                            />
                        </div>
                        <div className='flex-row w-full'>
                            <InputTextFilter
                                name='maxQuantityAvailable'
                                label='Cantidad maxima disponible:'
                                placeholder='Cantidad maxima disponible'
                                type='number'
                                value={form.maxQuantityAvailable.toString()}
                                onChange={(e) =>
                                    setForm(prev => ({ ...prev, maxQuantityAvailable: e.target.value }))
                                }
                            />
                        </div>
                    </div>

                    <div className={`flex ${isExtraSmallScreen ? 'flex-col gap-4' : 'flex-row gap-4'}`}>
                        <div className='flex-row w-full'>
                            <InputTextFilter
                                name='minQuantityReceived'
                                label='Cantidad minima recibida:'
                                placeholder='Cantidad minima recibida'
                                type='number'
                                value={form.minQuantityReceived.toString()}
                                onChange={(e) =>
                                    setForm(prev => ({ ...prev, minQuantityReceived: e.target.value }))
                                }
                            />
                        </div>
                        <div className='flex-row w-full'>
                            <InputTextFilter
                                name='maxQuantityReceived'
                                label='Cantidad maxima recibida:'
                                placeholder='Cantidad maxima recibida'
                                type='number'
                                value={form.maxQuantityReceived.toString()}
                                onChange={(e) =>
                                    setForm(prev => ({ ...prev, maxQuantityReceived: e.target.value }))
                                }
                            />
                        </div>
                    </div>




                    <div className={`flex ${isSmallScreen ? 'flex-col gap-4' : 'flex-row gap-4'}`}>

                        <SelectOptionFilter
                            name='companyId'
                            label='Empresa:'
                            options={companies}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, companyId: e.target.value }))
                            }
                            textInNullOption="Todas las empresas"
                            value={form.companyId}
                        />

                        <SelectOptionFilter
                            name='categoryId'
                            label='Categoría:'
                            options={categories}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, categoryId: e.target.value }))
                            }
                            textInNullOption="Todas las categorias"
                            value={form.categoryId}
                        />
                        <SelectOptionFilter
                            name='typeId'
                            label='Tipo:'
                            options={types}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, typeId: e.target.value }))
                            }
                            textInNullOption="Todos los tipos"
                            value={form.typeId}
                        />

                    </div>

                </FiltersFormContainer>
                <TableContainer
                    headers={['ID', 'Código', 'Producto', 'Cantidad restante', 'Fecha de entrada', 'Operaciones']}
                    isError={isError}
                    isEmpty={!content?.length}
                    itemsCounter={
                        data && <SearchCounter totalElements={data.totalElements} page={data.page} size={data.size} last={data.last} />
                    }
                    paginator={
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


                                    if (form.minQuantityReceived) params.set('minQuantityReceived', form.minQuantityReceived)
                                    if (form.maxQuantityReceived) params.set('maxQuantityReceived', form.maxQuantityReceived)
                                    if (form.minQuantityAvailable) params.set('minQuantityAvailable', form.minQuantityAvailable)
                                    if (form.maxQuantityAvailable) params.set('maxQuantityAvailable', form.maxQuantityAvailable)
                                    if (form.minCreatedAt) params.set('minCreatedAt', form.minCreatedAt)
                                    if (form.maxCreatedAt) params.set('maxCreatedAt', form.maxCreatedAt)
                                    if (form.keyword) params.set('keyword', form.keyword)
                                    if (form.companyId) params.set('companyId', form.companyId)
                                    if (form.categoryId) params.set('categoryId', form.categoryId)
                                    if (form.typeId) params.set('typeId', form.typeId)
                                    if (form.modelId) params.set('modelId', form.modelId)




                                    params.set('page', page.toString())

                                    setSearchParams(params)

                                }}
                            />
                        ) : null
                    }
                >
                    {
                        content?.map((stockLot: StockLotItem) => {
                            return <TableRowContainer key={stockLot.id}>
                                <BaseTableCell data={stockLot.id} />
                                <BaseTableCell data={
                                    <Link to={`/stocklots/${stockLot.id}`} className='hover:text-blue-900'>{stockLot.batch}</Link>
                                } />
                                <BaseTableCell data={
                                    <>
                                        <div>{stockLot.productName} (ID {stockLot.productId})</div>
                                        <div className='text-sm'>{stockLot.modelName} (ID {stockLot.modelId})</div>
                                    </>
                                } />
                                <BaseTableCell data={
                                    <>
                                        <div className='text-xl'>{stockLot.quantityAvailable} u.</div>
                                        <div className='text-sm'>de {stockLot.quantityReceived} u. recibidas</div>
                                    </>
                                } />
                                <BaseTableCell data={
                                    handleFormatDate(new Date(stockLot.createdAt))
                                } />

                                <BaseTableCell isCenter data={
                                    //* SOLAMENTE SI UN PRODUCTO ESTA ACTIVO, PUEDE SER EDITADO
                                    <div className='flex flex-col gap-2'>
                                        <Button
                                            type='button'
                                            size='small'
                                            text='Agregar'
                                            color='green-outline'
                                            onClick={() => {
                                                setIncreaseModalOpen(true)
                                                setSelectedStockLot(stockLot.id.toString())
                                            }}
                                            showTextOnMobile
                                        />
                                        <Button
                                            type='button'
                                            size='small'
                                            text='Quitar'
                                            color='red-outline'
                                            onClick={() => {
                                                setDecreaseModalOpen(true)
                                                setSelectedStockLot(stockLot.id.toString())
                                            }}
                                            showTextOnMobile
                                        />
                                        <Button
                                            type='button'
                                            size='small'
                                            text='Recuperar'
                                            color='blue-outline'
                                            onClick={() => {
                                                setRecoveryModalOpen(true)
                                                setSelectedStockLot(stockLot.id.toString())
                                            }}
                                            showTextOnMobile
                                        />
                                        <Button
                                            type='button'
                                            size='small'
                                            text='Transferir'
                                            color='blue-outline'
                                            onClick={() => {
                                                setTransferModalOpen(true)
                                                setSelectedStockLot(stockLot.id.toString())
                                            }}
                                            showTextOnMobile
                                        />
                                    </div>

                                } />
                            </TableRowContainer>
                        })
                    }

                    {
                        increaseModalOpen && selectedStockLot && <Modal
                            isOpen={increaseModalOpen}
                            onClose={() => {
                                setIncreaseModalOpen(false)
                                setSelectedStockLot('')
                            }
                            }
                            size='lg'
                            title={`Agregar cantidad al lote de stock #${selectedStockLot}`}
                            locked
                        >
                            <IncreaseStockLotModal stockLotId={selectedStockLot} showModal={setIncreaseModalOpen} />
                        </Modal>
                    }
                    {
                        decreaseModalOpen && selectedStockLot && <Modal
                            isOpen={decreaseModalOpen}
                            onClose={() => {
                                setDecreaseModalOpen(false)
                                setSelectedStockLot('')
                            }
                            }
                            size='lg'
                            title={`Disminuir cantidad al lote de stock #${selectedStockLot}`}
                            locked
                        >
                            <DecreaseStockLotModal stockLotId={selectedStockLot} showModal={setDecreaseModalOpen} />
                        </Modal>
                    }
                    {
                        recoveryModalOpen && selectedStockLot && <Modal
                            isOpen={recoveryModalOpen}
                            onClose={() => {
                                setRecoveryModalOpen(false)
                                setSelectedStockLot('')
                            }
                            }
                            size='lg'
                            title={`Recuperar cantidad del lote de stock #${selectedStockLot}`}
                            locked
                        >
                            <RecoveryStockLotModal stockLotId={selectedStockLot} showModal={setRecoveryModalOpen} />
                        </Modal>
                    }
                    {
                        transferModalOpen && selectedStockLot && <Modal
                            isOpen={transferModalOpen}
                            onClose={() => {
                                setTransferModalOpen(false)
                                setSelectedStockLot('')
                            }
                            }
                            size='lg'
                            title={`Transferir cantidad desde el lote de stock #${selectedStockLot}`}
                            locked
                        >
                            <LoaderTransferStockLot stockLotId={selectedStockLot} showModal={setTransferModalOpen} />
                        </Modal>
                    }



                </TableContainer>
            </EntityListLayout.Content>
        </EntityListLayout >
    )
}
