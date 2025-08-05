import { useMemo } from 'react'
import { formatDate } from '@/lib/utils'
import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { CalendarIcon } from 'lucide-react'

export function useTableColumns<TData>() {
  const selectedColumn = useMemo<ColumnDef<TData>>(
    () => ({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          className="translate-y-0.5"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          className="translate-y-0.5"
          aria-label="Select row"
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      size: 40,
      enableSorting: false,
      enableHiding: false,
    }),
    [],
  )

  const dateColumns = useMemo<ColumnDef<TData>[]>(
    () => [
      {
        id: 'created_at',
        header: 'Created At',
        accessorKey: 'created_at',
        cell: ({ row }) => {
          const createdAt = row.getValue<string | null>('created_at')
          return createdAt ? formatDate(createdAt) : '-'
        },
        meta: {
          label: 'Created At',
          variant: 'date',
          icon: CalendarIcon,
        },
        size: 160,
        enableColumnFilter: true,
        enableSorting: true,
        enableHiding: true,
      },
      {
        id: 'updated_at',
        header: 'Updated At',
        accessorKey: 'updated_at',
        cell: ({ row }) => {
          const updatedAt = row.getValue<string | null>('updated_at')
          return updatedAt ? formatDate(updatedAt) : '-'
        },
        meta: {
          label: 'Updated At',
          variant: 'date',
          icon: CalendarIcon,
        },
        size: 160,
        enableColumnFilter: true,
        enableSorting: true,
        enableHiding: true,
      },
    ],
    [],
  )

  return { selectedColumn, dateColumns }
}
