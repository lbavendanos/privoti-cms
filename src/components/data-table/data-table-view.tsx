import { useMemo } from 'react'
import type { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Columns3Icon } from 'lucide-react'

type DataTableViewProps<TData> = {
  table: Table<TData>
}

export function DataTableView<TData>({ table }: DataTableViewProps<TData>) {
  const toggleableColumns = useMemo(
    () => table.getAllColumns().filter((column) => column.getCanHide()),
    [table],
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-7 w-fit !px-2">
          <Columns3Icon className="size-4 opacity-60" aria-hidden="true" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        {toggleableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className="capitalize"
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
            onSelect={(event) => event.preventDefault()}
          >
            {column.columnDef.meta?.label ?? column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
