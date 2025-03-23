'use client'

import { getProducts } from '@/core/actions/product'
import { useSuspenseQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductsTable } from './products-table'

export function Products() {
  const { data: products } = useSuspenseQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  })

  return (
    <div className="container my-4 h-full lg:my-6">
      <div className="grid h-full grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-10 md:col-start-2">
          <div className="flex h-full flex-col gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
            {products?.length === 0 ? (
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
              <ProductsTable data={products} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
