'use client'

import { getProducts } from '@/core/actions/product'
import { blank, debounce, filled } from '@/lib/utils'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductsTable } from './products-table'

const DEFAULT_PER_PAGE = 15
const DEFAULT_PAGE = 1

export function Products() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const params: {
    search?: string
    per_page?: string
    page?: string
  } = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams])

  const [searchTerm, setSearchTerm] = useState(params.search ?? '')
  const [perPage, setPerPage] = useState(
    params.per_page ? Number(params.per_page) : DEFAULT_PER_PAGE,
  )
  const [page, setPage] = useState(
    params.page ? Number(params.page) : DEFAULT_PAGE,
  )

  const { data } = useQuery({
    queryKey: filled(params) ? ['product-list', params] : ['product-list'],
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
  })

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
      const newParams = new URLSearchParams(searchParams)

      if (value) {
        newParams.set(name, value)
      } else {
        newParams.delete(name)
      }

      const newUrl = newParams.toString()
        ? `${pathname}?${newParams.toString()}`
        : pathname

      window.history.pushState(null, '', newUrl)
    },
    [searchParams, pathname],
  )

  const debouncedUpdateSearchTerm = useMemo(
    () =>
      debounce((newSearchTerm: string) => {
        if (newSearchTerm !== params.search)
          updateQueryParams('search', newSearchTerm)
      }, 500),
    [params.search, updateQueryParams],
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
    updateQueryParams('search', '')
  }, [updateQueryParams])

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

  return (
    <div className="container my-4 h-full lg:my-6">
      <div className="grid h-full grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-10 md:col-start-2">
          <div className="flex h-full flex-col gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
            {blank(params) && products?.length === 0 ? (
              <div className="flex grow flex-col items-center justify-center gap-1 rounded-lg border border-dashed bg-white p-4 shadow-sm">
                <h3 className="text-2xl font-bold tracking-tight">
                  You have no products
                </h3>
                <p className="text-sm text-muted-foreground">
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
                perPage={perPage}
                page={page}
                pagination={pagination}
                onSearchTermChange={handleSearchTermChange}
                onClearSearchTerm={handleClearSearchTerm}
                onPerPageChange={handlePerPageChange}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
