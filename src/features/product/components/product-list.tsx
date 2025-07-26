import { blank } from '@/lib/utils'
import { getRouteApi } from '@tanstack/react-router'
import { useProductList } from '../hooks/use-product-list'
import { useDeferredValue } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ProductEmpty } from './product-empty'
import { ProductTable } from './product-table'
import { PlusIcon } from 'lucide-react'

const route = getRouteApi('/_authenticated/(app)/products/')

export function ProductList() {
  const searchParams = route.useSearch()
  const deferredSearchParams = useDeferredValue(searchParams)
  const { products, productCount, productTypes, vendors } = useProductList({
    searchParams: deferredSearchParams,
  })

  if (blank(deferredSearchParams) && productCount === 0) return <ProductEmpty />

  return (
    <div className="@container mx-auto my-4 size-full max-w-5xl px-4 lg:my-6">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
          <Button className="ml-auto" variant="outline" asChild>
            <Link from="/products" to="/products/create">
              <PlusIcon
                className="-ms-1 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Add product
            </Link>
          </Button>
        </div>
        <ProductTable
          products={products}
          productCount={productCount}
          productTypes={productTypes}
          vendors={vendors}
        />
      </div>
    </div>
  )
}
