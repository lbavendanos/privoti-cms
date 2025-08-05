import { useDataTable } from '@/hooks/use-data-table'
import { useTableSort } from '@/hooks/use-table-sort'
import { useTablePagination } from '@/hooks/use-table-pagination'
import { useProductTableColumns } from '../hooks/use-product-table-columns'
import { useProductTableFilters } from '../hooks/use-product-table-filters'
import type { Product, ProductType, Vendor } from '@/core/types'
import { DataTable } from '@/components/data-table/data-table'
import { ProductTableActionBar } from './product-table-action-bar'

const routeId = '/_authenticated/(app)/products/'

type ProductTableProps = {
  products: Product[]
  productCount: number
  productTypes: ProductType[]
  vendors: Vendor[]
}

export function ProductTable({
  products,
  productCount,
  productTypes,
  vendors,
}: ProductTableProps) {
  const { columns } = useProductTableColumns({ productTypes, vendors })
  const { filters, setFilters } = useProductTableFilters()
  const { pagination, setPagination } = useTablePagination(routeId)
  const { sorting, setSorting } = useTableSort(routeId)

  const { table } = useDataTable<Product>({
    data: products,
    columns,
    rowCount: productCount,
    filters,
    pagination,
    sorting,
    columnVisibility: {
      created_at: false,
      updated_at: false,
    },
    columnPinning: {
      right: ['actions'],
    },
    onFilterChange: setFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  })

  return (
    <DataTable
      table={table}
      rowNavigation={(row) => ({
        from: '/products',
        to: '/products/$productId',
        params: { productId: `${row.original.id}` },
      })}
      actionBar={<ProductTableActionBar table={table} />}
    />
  )
}
