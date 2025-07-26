import { useCallback, useMemo } from 'react'
import type { Table } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ArrowUpDownIcon } from 'lucide-react'

type SortDirection = 'asc' | 'desc' | string

type SortItem = {
  value: string
  label: string
}

type DatatbleSortProps<TData> = {
  table: Table<TData>
}

export function DataTableSort<TData>({ table }: DatatbleSortProps<TData>) {
  const sorting = table.getState().sorting
  const setSorting = table.setSorting

  const items: SortItem[] = useMemo(
    () =>
      table
        .getAllColumns()
        .filter((column) => column.getCanSort())
        .map((column) => {
          const value = column.id
          const label = column.columnDef.meta?.label ?? column.id

          return { value, label }
        }),
    [table],
  )

  const handleColumnChange = useCallback(
    (columnId: string) => {
      if (!columnId) return

      setSorting([
        {
          id: columnId,
          desc: sorting[0]?.desc ?? false,
        },
      ])
    },
    [sorting, setSorting],
  )

  const handleDirectionChange = useCallback(
    (direction: SortDirection) => {
      if (!sorting[0]) return

      setSorting([
        {
          id: sorting[0].id,
          desc: direction === 'desc',
        },
      ])
    },
    [sorting, setSorting],
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-7 w-fit !px-2">
          <ArrowUpDownIcon className="size-4 opacity-60" aria-hidden="true" />
          <span>Sort</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Order</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={sorting[0]?.id ?? ''}
          onValueChange={handleColumnChange}
        >
          {items.map((item) => (
            <DropdownMenuRadioItem
              key={item.value}
              value={item.value}
              onSelect={(event) => event.preventDefault()}
            >
              {item.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>By</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={sorting[0]?.desc ? 'desc' : 'asc'}
          onValueChange={handleDirectionChange}
        >
          <DropdownMenuRadioItem
            value="asc"
            onSelect={(e) => e.preventDefault()}
          >
            Ascending
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="desc"
            onSelect={(e) => e.preventDefault()}
          >
            Descending
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
