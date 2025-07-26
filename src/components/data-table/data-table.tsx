import { flexRender } from '@tanstack/react-table'
import type { CSSProperties } from 'react'
import type { NavigateOptions } from '@tanstack/react-router'
import type { Column, Table as ReactTable, Row } from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Link } from '@tanstack/react-router'
import { DataTableSort } from './data-table-sort'
import { DataTableView } from './data-table-view'
import { DataTableFilter } from './data-table-filter'
import { DataTablePagination } from './data-table-pagination'

export function getCommonPinningStyles<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>
  withBorder?: boolean
}): CSSProperties {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: withBorder
      ? isLastLeftPinnedColumn
        ? '-4px 0 4px -4px var(--border) inset'
        : isFirstRightPinnedColumn
          ? '4px 0 4px -4px var(--border) inset'
          : undefined
      : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? 'sticky' : 'relative',
    background: isPinned ? 'var(--background)' : 'var(--background)',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  }
}

type DataTableProps<TData> = {
  table: ReactTable<TData>
  rowNavigation: (row: Row<TData>) => NavigateOptions
  actionBar?: React.ReactNode
}

export function DataTable<TData>({
  table,
  rowNavigation,
  actionBar,
}: DataTableProps<TData>) {
  return (
    <div className="w-full space-y-4 overflow-auto">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <DataTableSort table={table} />
        <DataTableView table={table} />
        <DataTableFilter table={table} />
      </div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="h-11"
                    style={{
                      ...getCommonPinningStyles({ column: header.column }),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="h-14"
                      style={{
                        ...getCommonPinningStyles({ column: cell.column }),
                      }}
                    >
                      {cell.column.id !== 'select' &&
                      cell.column.id !== 'actions' ? (
                        <Link {...rowNavigation(row)}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Link>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      {actionBar && actionBar}
    </div>
  )
}
