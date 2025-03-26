'use client'

import { getProducts } from '@/core/actions/product'
import { blank, debounce, filled } from '@/lib/utils'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductsTable } from './products-table'

export function Products() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const params: {
    search?: string
  } = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams])
  const [searchTerm, setSearchTerm] = useState(params.search ?? '')

  const { data: products } = useQuery({
    queryKey: filled(params) ? ['product-list', params] : ['product-list'],
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
  })

  const updateQueryParams = useCallback(
    (name: string, value: string) => {
      const newParams = new URLSearchParams(searchParams.toString())

      if (value) {
        newParams.set(name, value)
      } else {
        newParams.delete(name)
      }

      window.history.pushState(null, '', `${pathname}?${newParams}`)
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
                onSearchTermChange={handleSearchTermChange}
                onClearSearchTerm={handleClearSearchTerm}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
