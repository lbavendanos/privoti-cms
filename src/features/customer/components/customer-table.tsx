import { useDataTable } from '@/hooks/use-data-table'
import { useTableSort } from '@/hooks/use-table-sort'
import { useTablePagination } from '@/hooks/use-table-pagination'
import { useCustomerTableColumns } from '../hooks/use-customer-table-columns'
import { useCustomerTableFilters } from '../hooks/use-customer-table-filters'
import type { Customer } from '@/core/types'
import { DataTable } from '@/components/data-table/data-table'
import { CustomerTableActionBar } from './customer-table-action-bar'

const routeId = '/_authenticated/(app)/customers/'

type CustomerTableProps = {
  customers: Customer[]
  customerCount: number
}

export function CustomerTable({
  customers,
  customerCount,
}: CustomerTableProps) {
  const { columns } = useCustomerTableColumns()
  const { filters, setFilters } = useCustomerTableFilters()
  const { pagination, setPagination } = useTablePagination(routeId)
  const { sorting, setSorting } = useTableSort(routeId)

  const { table } = useDataTable<Customer>({
    data: customers,
    columns,
    rowCount: customerCount,
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
        from: '/customers',
        to: '/customers/$customerId',
        params: { customerId: `${row.original.id}` },
      })}
      actionBar={<CustomerTableActionBar table={table} />}
    />
  )
}
