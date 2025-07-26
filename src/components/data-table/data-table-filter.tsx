import { blank, cn, filled } from '@/lib/utils'
import { useCallback, useMemo } from 'react'
import type { Column, Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { ActiveFilter } from './filter/active-filter'
import { FilterSelector } from './filter/filter-selector'
import { FilterXIcon } from 'lucide-react'

type DataTableFilterProps<TData> = {
  table: Table<TData>
}

export function DataTableFilter<TData>({ table }: DataTableFilterProps<TData>) {
  const columns = useMemo(
    () =>
      table
        .getAllColumns()
        .filter((column) => column.columnDef.enableColumnFilter),
    [table],
  )

  const hasFilters = columns.some((column) => filled(column.getFilterValue()))

  const renderActiveFilter = useCallback((column: Column<TData>) => {
    const filterValue = column.getFilterValue()

    if (!filterValue || blank(filterValue)) return null

    return <ActiveFilter key={column.id} column={column} />
  }, [])

  if (!columns.length) return null

  return (
    <>
      <FilterSelector columns={columns} />
      <div className="flex flex-wrap items-center gap-2">
        {columns.map(renderActiveFilter)}
        <Button
          variant="destructive"
          className={cn('h-7 !px-2', !hasFilters && 'hidden')}
          onClick={() => table.resetColumnFilters(true)}
        >
          <FilterXIcon />
          <span>Clear</span>
        </Button>
      </div>
    </>
  )
}
