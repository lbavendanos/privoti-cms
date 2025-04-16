'use client'

import { toast } from '@/components/ui/toast'
import { useProducts } from '@/core/hooks/product'
import { useQueryClient } from '@tanstack/react-query'
import { blank, debounce } from '@/lib/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { startTransition, useCallback, useMemo, useState } from 'react'
import {
  updateProduct,
  deleteProduct,
  deleteProducts,
} from '@/core/actions/product'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductsTable } from './products-table'

const DEFAULT_PER_PAGE = 15
const DEFAULT_PAGE = 1

export function Products() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  const params: {
    q?: string
    status?: string
    order?: string
    per_page?: string
    page?: string
  } = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams])

  const [searchTerm, setSearchTerm] = useState(params.q ?? '')
  const [status, setStatus] = useState<string[] | null>(
    () => params.status?.split(',') ?? null,
  )
  const [order, setOrder] = useState<{
    column: string
    direction: string
  } | null>(() => {
    if (!params.order) return null

    const direction = params.order.startsWith('-') ? 'desc' : 'asc'
    const column = direction === 'desc' ? params.order.slice(1) : params.order

    return { column, direction }
  })
  const [perPage, setPerPage] = useState(
    params.per_page ? Number(params.per_page) : DEFAULT_PER_PAGE,
  )
  const [page, setPage] = useState(
    params.page ? Number(params.page) : DEFAULT_PAGE,
  )

  const { data } = useProducts(params)
  const products = useMemo(() => data?.data, [data])
  const meta = useMemo(() => data?.meta, [data])
  const pagination = useMemo(
    () =>
      meta
        ? {
            from: meta.from,
            to: meta.to,
            lastPage: meta.last_page,
            total: meta.total,
          }
        : undefined,
    [meta],
  )

  const updateQueryParams = useCallback(
    (name: string, value: string) => {
      startTransition(() => {
        const newParams = new URLSearchParams(searchParams)

        if (value) {
          newParams.set(name, value)
        } else {
          newParams.delete(name)
        }

        const newUrl = newParams.toString()
          ? `${pathname}?${newParams.toString()}`
          : pathname

        router.replace(newUrl)
      })
    },
    [searchParams, pathname, router],
  )

  const debouncedUpdateSearchTerm = useMemo(
    () =>
      debounce((newSearchTerm: string) => {
        if (newSearchTerm !== params.q) updateQueryParams('q', newSearchTerm)
      }, 500),
    [params.q, updateQueryParams],
  )

  const handleSearchTermChange = useCallback(
    (newSearchTerm: string) => {
      setSearchTerm(newSearchTerm)
      debouncedUpdateSearchTerm(newSearchTerm)
    },
    [debouncedUpdateSearchTerm],
  )

  const handleClearSearchTerm = useCallback(() => {
    setSearchTerm('')
    updateQueryParams('q', '')
  }, [updateQueryParams])

  const handleStatusChange = useCallback(
    (newStatus: string[]) => {
      setStatus(newStatus)
      updateQueryParams('status', newStatus.join(','))
    },
    [updateQueryParams],
  )

  const handleOrderChange = useCallback(
    (newOrder: { column: string; direction: string } | null) => {
      setOrder(newOrder)
      updateQueryParams(
        'order',
        newOrder
          ? `${newOrder.direction === 'desc' ? '-' : ''}${newOrder.column}`
          : '',
      )
    },
    [updateQueryParams],
  )

  const handlePerPageChange = useCallback(
    (newPerPage: number) => {
      setPerPage(newPerPage)
      updateQueryParams('per_page', `${newPerPage}`)
    },
    [updateQueryParams],
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage)
      updateQueryParams('page', `${newPage}`)
    },
    [updateQueryParams],
  )

  const handleRowStatusChange = useCallback(
    (id: number, status: string) => {
      startTransition(async () => {
        const response = await updateProduct(id, { status })

        if (response.isServerError) {
          toast.destructive(response.message)
        }

        if (response.isClientError) {
          toast.error(response.message)
        }

        if (response.isSuccess) {
          toast.success('Product updated successfully.')
          queryClient.setQueryData(
            ['product-detail', { id: `${id}` }],
            response.data,
          )
          queryClient.invalidateQueries({ queryKey: ['product-list'] })
        }
      })
    },
    [queryClient],
  )

  const handleDeleteRow = useCallback(
    (id: number) => {
      startTransition(async () => {
        const response = await deleteProduct(id)

        if (response.isServerError) {
          toast.destructive(response.message)
        }

        if (response.isClientError) {
          toast.error(response.message)
        }

        if (response.isSuccess) {
          toast.success('Product deleted successfully.')
          queryClient.invalidateQueries({
            queryKey: ['product-detail', { id: `${id}` }],
          })
          queryClient.invalidateQueries({ queryKey: ['product-list'] })
        }
      })
    },
    [queryClient],
  )

  const handleDeleteRows = useCallback(
    (ids: number[]) => {
      startTransition(async () => {
        const response = await deleteProducts(ids)

        if (response.isServerError) {
          toast.destructive(response.message)
        }

        if (response.isClientError) {
          toast.error(response.message)
        }

        if (response.isSuccess) {
          toast.success('Products deleted successfully.')
          ids.forEach((id) => {
            queryClient.invalidateQueries({
              queryKey: ['product-detail', { id: `${id}` }],
            })
          })
          queryClient.invalidateQueries({ queryKey: ['product-list'] })
        }
      })
    },
    [queryClient],
  )

  return (
    <div className="@container mx-auto my-4 size-full max-w-5xl px-4 lg:my-6">
      <div className="flex h-full flex-col gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
        {blank(params) && products?.length === 0 ? (
          <div className="flex grow flex-col items-center justify-center gap-1 rounded-lg border border-dashed bg-white p-4 shadow-sm">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no products
            </h3>
            <p className="text-muted-foreground text-sm">
              You can start selling as soon as you add a product.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/products/create">Add product</Link>
            </Button>
          </div>
        ) : (
          <ProductsTable
            data={products ?? []}
            searchTerm={searchTerm}
            status={status}
            order={order}
            perPage={perPage}
            page={page}
            pagination={pagination}
            onSearchTermChange={handleSearchTermChange}
            onClearSearchTerm={handleClearSearchTerm}
            onStatusChange={handleStatusChange}
            onOrderChange={handleOrderChange}
            onPerPageChange={handlePerPageChange}
            onPageChange={handlePageChange}
            onRowStatusChange={handleRowStatusChange}
            onDeleteRows={handleDeleteRows}
            onDeleteRow={handleDeleteRow}
          />
        )}
      </div>
    </div>
  )
}
