import { useCallback, useMemo, useState } from 'react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/lib/constants'
import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  PaginationState,
  SortingState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table'

type DataTablePaginationState = {
  page?: number
  per_page?: number
}

type UseDataTableProps<TData> = {
  data: TData[]
  columns: ColumnDef<TData>[]
  rowCount: number
  filters?: Record<string, unknown>
  pagination?: DataTablePaginationState
  sorting?: string
  columnVisibility?: VisibilityState
  columnPinning?: ColumnPinningState
  onFilterChange?: (filters: Record<string, unknown>) => void
  onPaginationChange?: (pagination: DataTablePaginationState) => void
  onSortingChange?: (sorting: string) => void
}

export function useDataTable<TData>({
  data,
  columns,
  rowCount,
  filters: filtersProp,
  pagination: paginationProp,
  sorting: sortingProp,
  columnVisibility: columnVisibilityProp,
  columnPinning: columnPinningProp,
  onFilterChange,
  onPaginationChange,
  onSortingChange,
}: UseDataTableProps<TData>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    columnVisibilityProp ?? {},
  )
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(
    columnPinningProp ?? {},
  )

  const columnFilters: ColumnFiltersState = useMemo(() => {
    if (!filtersProp) return []

    return Object.entries(filtersProp)
      .filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      )
      .map(([id, value]) => ({
        id,
        value,
      }))
  }, [filtersProp])

  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: (paginationProp?.page ?? DEFAULT_PAGE) - 1,
      pageSize: paginationProp?.per_page ?? DEFAULT_PER_PAGE,
    }),
    [paginationProp],
  )

  const sorting: SortingState = useMemo(() => {
    if (!sortingProp) return []

    const desc = sortingProp.startsWith('-')
    const id = sortingProp.replace('-', '')

    return [{ id, desc }]
  }, [sortingProp])

  const handleFiltersChange = useCallback(
    (newColumnFilters: Updater<ColumnFiltersState>) => {
      const newColumnFiltersState =
        typeof newColumnFilters === 'function'
          ? newColumnFilters(columnFilters)
          : newColumnFilters

      const newFilters = newColumnFiltersState.reduce(
        (acc, filter) => {
          acc[filter.id] = filter.value
          return acc
        },
        {} as Record<string, unknown>,
      )

      const newFilterIds = new Set(newColumnFiltersState.map((f) => f.id))

      for (const prevFilter of columnFilters) {
        if (!newFilterIds.has(prevFilter.id)) {
          newFilters[prevFilter.id] = undefined
        }
      }

      onFilterChange?.(newFilters)
      onPaginationChange?.({ page: DEFAULT_PAGE })
    },
    [columnFilters, onFilterChange, onPaginationChange],
  )

  const handlePaginationChange = useCallback(
    (newPagination: Updater<PaginationState>) => {
      const newPaginationState =
        typeof newPagination === 'function'
          ? newPagination(pagination)
          : newPagination

      onPaginationChange?.({
        page: newPaginationState.pageIndex + 1,
        per_page: newPaginationState.pageSize,
      })
    },
    [pagination, onPaginationChange],
  )

  const handleSortingChange = useCallback(
    (newSorting: Updater<SortingState>) => {
      const newSortingState =
        typeof newSorting === 'function' ? newSorting(sorting) : newSorting

      const desc = newSortingState[0].desc
      const id = newSortingState[0].id

      onSortingChange?.(desc ? `-${id}` : id)
    },
    [sorting, onSortingChange],
  )

  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      columnFilters,
      pagination,
      sorting,
      columnVisibility,
      columnPinning,
    },
    rowCount,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    debugTable: true,
    onColumnFiltersChange: handleFiltersChange,
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
  })

  return { table }
}
