'use client'

import { capitalize, cn } from '@/lib/utils'
import { useCallback, useId, useMemo, useRef, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { Product } from '@/core/types'
import type { ColumnDef, Row, VisibilityState } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleXIcon,
  Columns3Icon,
  EllipsisIcon,
  FilterIcon,
  ListFilterIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react'

type Item = Product

function makeColumns({
  onActive,
  onDraft,
  onArchived,
  onDelete,
}: {
  onActive?: (row: Row<Item>) => void
  onDraft?: (row: Row<Item>) => void
  onArchived?: (row: Row<Item>) => void
  onDelete: (row: Row<Item>) => void
}): ColumnDef<Item>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <div className="flex h-full w-full items-center p-4 pr-0">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      size: 28,
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: 'Product',
      accessorKey: 'title',
      cell: ({ row }) => (
        <div className="flex h-full w-full items-center gap-x-3 px-4">
          <Avatar className="w-8 rounded-md">
            <AvatarImage
              src={row.original.thumbnail!}
              alt={row.getValue('title')}
            />
            <AvatarFallback className="w-8 rounded-md">
              {row.getValue<string>('title').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium">{row.getValue('title')}</div>
        </div>
      ),
      size: 220,
      enableHiding: false,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <div className="flex h-full w-full items-center px-4">
          <Badge
            className={cn(
              row.getValue('status') === 'draft' &&
                'bg-amber-500 hover:bg-amber-500',
              row.getValue('status') === 'active' &&
                'bg-emerald-600 hover:bg-emerald-600',
              row.getValue('status') === 'archived' &&
                'bg-gray-500 hover:bg-gray-500',
            )}
          >
            {capitalize(row.getValue('status'))}
          </Badge>
        </div>
      ),
      size: 100,
      enableSorting: false,
    },
    {
      id: 'invertory',
      header: 'Inventory',
      accessorKey: 'stock',
      cell: ({ row }) => (
        <div className="flex h-full w-full items-center px-4">
          <div className="block">
            <span
              className={
                row.getValue<number>('invertory') < 10
                  ? 'text-destructive'
                  : 'text-foreground'
              }
            >
              {row.getValue('invertory')} in stock
            </span>{' '}
            <span>
              for {row.original.variants?.length} variant
              {row.original.variants &&
                row.original.variants?.length > 0 &&
                's'}
            </span>
          </div>
        </div>
      ),
      size: 200,
      enableSorting: false,
    },
    {
      id: 'category',
      header: 'Category',
      accessorFn: (row) => row.category?.name ?? null,
      cell: ({ row }) => (
        <div className="flex h-full w-full items-center px-4">
          <span>{row.getValue('category') ?? '-'}</span>
        </div>
      ),
      size: 100,
      enableSorting: false,
    },
    {
      id: 'type',
      header: 'Type',
      accessorFn: (row) => row.type?.name ?? null,
      cell: ({ row }) => (
        <div className="flex h-full w-full items-center px-4">
          <span>{row.getValue('type') ?? '-'}</span>
        </div>
      ),
      size: 100,
      enableSorting: false,
    },
    {
      id: 'vendor',
      header: 'Vendor',
      accessorFn: (row) => row.vendor?.name ?? null,
      cell: ({ row }) => (
        <div className="flex h-full w-full items-center px-4">
          <span>{row.getValue('vendor') ?? '-'}</span>
        </div>
      ),
      size: 100,
      enableSorting: false,
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex h-full w-full items-center px-4">
          <RowActions
            row={row}
            onActiveSelect={onActive}
            onDraftSelect={onDraft}
            onArchivedSelect={onArchived}
            onDeleteSelect={onDelete}
          />
        </div>
      ),
      size: 60,
      enableHiding: false,
      enableSorting: false,
    },
  ]
}

type PaginationInfo = {
  from: number | null
  to: number | null
  lastPage: number
  total: number
}

type Order = {
  column: string
  direction: string
}

type ProductsTableProps = {
  data: Item[]
  searchTerm?: string
  status?: string[] | null
  order?: Order | null
  perPage?: number
  page?: number
  pagination?: PaginationInfo
  onSearchTermChange?: (searchTerm: string) => void
  onClearSearchTerm?: () => void
  onStatusChange?: (status: string[]) => void
  onOrderChange?: (order: Order) => void
  onPerPageChange?: (perPage: number) => void
  onPageChange?: (page: number) => void
  onRowStatusChange?: (id: number, status: string) => void
  onDeleteRow?: (id: number) => void
  onDeleteRows?: (ids: number[]) => void
}

export function ProductsTable({
  data,
  searchTerm,
  status,
  order,
  perPage,
  page,
  pagination,
  onSearchTermChange,
  onClearSearchTerm,
  onStatusChange,
  onOrderChange,
  onPerPageChange,
  onPageChange,
  onRowStatusChange,
  onDeleteRow,
  onDeleteRows,
}: ProductsTableProps) {
  const id = useId()

  const [selectedRow, setSelectedRow] = useState<Row<Item>>()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const columns = useMemo(
    () =>
      makeColumns({
        onActive: (row: Row<Item>) => {
          setSelectedRow(row)
          onRowStatusChange?.(row.original.id, 'active')
        },
        onDraft: (row: Row<Item>) => {
          setSelectedRow(row)
          onRowStatusChange?.(row.original.id, 'draft')
        },
        onArchived: (row: Row<Item>) => {
          setSelectedRow(row)
          onRowStatusChange?.(row.original.id, 'archived')
        },
        onDelete: (row: Row<Item>) => {
          setSelectedRow(row)
          setOpenDeleteDialog(true)
        },
      }),
    [onRowStatusChange],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  })

  const handleDeleteRows = useCallback(() => {
    const selectedRows = table.getSelectedRowModel().rows
    const selectedIds = selectedRows.map((row) => row.original.id)

    onDeleteRows?.(selectedIds)
  }, [table, onDeleteRows])

  const handleDeleteRow = useCallback(() => {
    if (selectedRow) {
      onDeleteRow?.(selectedRow.original.id)
    }
  }, [selectedRow, onDeleteRow])

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter by title */}
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn('peer min-w-60 ps-9', searchTerm && 'pe-9')}
              value={searchTerm}
              onChange={(e) => onSearchTermChange?.(e.target.value)}
              placeholder="Filter by title"
              type="text"
              aria-label="Filter by title"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <ListFilterIcon size={16} aria-hidden="true" />
            </div>
            {searchTerm && (
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  onClearSearchTerm?.()

                  if (inputRef.current) {
                    inputRef.current.focus()
                  }
                }}
              >
                <CircleXIcon size={16} aria-hidden="true" />
              </button>
            )}
          </div>
          {/* Filter by status */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <FilterIcon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Status
                {status && status.length > 0 && (
                  <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                    {status.join(', ')}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-36 p-3" align="start">
              <div className="space-y-3">
                <div className="text-xs font-medium text-muted-foreground">
                  Filters
                </div>
                <div className="space-y-3">
                  {['active', 'archived', 'draft'].map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-${i}`}
                        checked={status?.includes(value)}
                        onCheckedChange={(checked: boolean) => {
                          const updatedStatus = checked
                            ? [...(status ?? []), value]
                            : (status?.filter((status) => status !== value) ??
                              [])

                          onStatusChange?.(updatedStatus)
                        }}
                      />
                      <Label
                        htmlFor={`${id}-${i}`}
                        className="flex grow cursor-pointer font-normal"
                      >
                        {capitalize(value)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {/* Toggle columns visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Columns3Icon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="cursor-pointer"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      onSelect={(event) => event.preventDefault()}
                    >
                      {capitalize(column.id)}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-3">
          {/* Delete button */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto" variant="outline">
                  <TrashIcon
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Delete
                  <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete{' '}
                      <strong>{table.getSelectedRowModel().rows.length}</strong>{' '}
                      selected{' '}
                      {table.getSelectedRowModel().rows.length === 1
                        ? 'product'
                        : 'products'}
                      . This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {/* Add product button */}
          <Button className="ml-auto" variant="outline" asChild>
            <Link href="/products/create">
              <PlusIcon
                className="-ms-1 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Add product
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border bg-background">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="h-11"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              'flex h-full cursor-pointer select-none items-center justify-between gap-2',
                          )}
                          onClick={() =>
                            onOrderChange?.({
                              column: header.column.id,
                              direction:
                                order?.column === header.column.id
                                  ? order.direction === 'asc'
                                    ? 'desc'
                                    : 'asc'
                                  : 'asc',
                            })
                          }
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (
                              header.column.getCanSort() &&
                              (e.key === 'Enter' || e.key === ' ')
                            ) {
                              e.preventDefault()

                              onOrderChange?.({
                                column: header.column.id,
                                direction:
                                  order?.column === header.column.id
                                    ? order.direction === 'asc'
                                      ? 'desc'
                                      : 'asc'
                                    : 'asc',
                              })
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[
                            (order?.column === header.column.id &&
                              order.direction) as string
                          ] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-14 p-0">
                      {cell.column.id !== 'select' &&
                      cell.column.id !== 'actions' ? (
                        <Link
                          href={`/products/${row.original.id}`}
                          className="block h-full w-full"
                        >
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-8">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            Rows per page
          </Label>
          <Select
            value={perPage?.toString()}
            onValueChange={(value) => {
              onPerPageChange?.(Number(value))
            }}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
              {[5, 15, 25, 50].map((perPageOption) => (
                <SelectItem
                  key={perPageOption}
                  value={perPageOption.toString()}
                  className="cursor-pointer"
                >
                  {perPageOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Page number information */}
        {pagination && pagination.from && pagination.to && (
          <div className="flex grow justify-end whitespace-nowrap text-sm text-muted-foreground">
            <p
              className="whitespace-nowrap text-sm text-muted-foreground"
              aria-live="polite"
            >
              <span className="text-foreground">
                {pagination.from} - {pagination.to}
              </span>{' '}
              of <span className="text-foreground">{pagination.total}</span>
            </p>
          </div>
        )}

        {/* Pagination buttons */}
        {page && pagination && pagination.lastPage && (
          <div>
            <Pagination>
              <PaginationContent>
                {/* First page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => onPageChange?.(1)}
                    disabled={page === 1}
                    aria-label="Go to first page"
                  >
                    <ChevronFirstIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
                {/* Previous page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => onPageChange?.(page - 1)}
                    disabled={page === 1}
                    aria-label="Go to previous page"
                  >
                    <ChevronLeftIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
                {/* Next page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => onPageChange?.(page + 1)}
                    disabled={page === pagination.lastPage}
                    aria-label="Go to next page"
                  >
                    <ChevronRightIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
                {/* Last page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => onPageChange?.(pagination.lastPage)}
                    disabled={page === pagination.lastPage}
                    aria-label="Go to last page"
                  >
                    <ChevronLastIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete the product{' '}
              <strong>{selectedRow?.original.title}</strong>. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteRow}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function RowActions({
  row,
  onActiveSelect,
  onDraftSelect,
  onArchivedSelect,
  onDeleteSelect,
}: {
  row: Row<Item>
  onActiveSelect?: (row: Row<Item>) => void
  onDraftSelect?: (row: Row<Item>) => void
  onArchivedSelect?: (row: Row<Item>) => void
  onDeleteSelect?: (row: Row<Item>) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Edit item"
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href={`/products/${row.original.id}`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {['active', 'draft', 'archived'].map((status) => {
              if (status !== row.original.status) {
                return (
                  <DropdownMenuItem
                    key={status}
                    className="cursor-pointer"
                    onSelect={() => {
                      if (status === 'active') {
                        onActiveSelect?.(row)
                      } else if (status === 'draft') {
                        onDraftSelect?.(row)
                      } else if (status === 'archived') {
                        onArchivedSelect?.(row)
                      }
                    }}
                  >
                    {capitalize(status)}
                  </DropdownMenuItem>
                )
              }

              return null
            })}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onSelect={() => onDeleteSelect?.(row)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
