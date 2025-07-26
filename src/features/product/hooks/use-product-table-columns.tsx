import { memo, useMemo } from 'react'
import { capitalize, formatDate } from '@/lib/utils'
import { getProductStatusIcon, getProductStatusBadgeStyle } from '../lib/utils'
import { PRODUCT_STATUS_LIST } from '../lib/constants'
import type { Product, ProductStatus, ProductType, Vendor } from '@/core/types'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ProductTableRowAction } from '../components/product-table-row-action'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  CalendarIcon,
  CircleDotDashedIcon,
  ContainerIcon,
  ShapesIcon,
  TextIcon,
} from 'lucide-react'

const MemoizedProductTableRowAction = memo(ProductTableRowAction)

type UseProductTableColumnsProps = {
  productTypes: ProductType[]
  vendors: Vendor[]
}

export function useProductTableColumns({
  productTypes,
  vendors,
}: UseProductTableColumnsProps) {
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            aria-label="Select all"
            className="translate-y-0.5"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
      },
      {
        id: 'title',
        header: 'Product',
        accessorKey: 'title',
        cell: ({ row }) => {
          const title = row.getValue<string>('title')

          return (
            <div className="flex size-full items-center gap-x-3">
              <Avatar className="w-8 rounded-md">
                <AvatarImage src={row.original.thumbnail} alt={title} />
                <AvatarFallback className="w-8 rounded-md">
                  {title.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="font-medium">{title}</div>
            </div>
          )
        },
        meta: {
          label: 'Title',
          placeholder: 'Search titles...',
          variant: 'text',
          icon: TextIcon,
        },
        size: 220,
        enableColumnFilter: true,
        enableSorting: true,
        enableHiding: false,
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
          const status = row.getValue<ProductStatus>('status')

          return (
            <Badge className={getProductStatusBadgeStyle(status)}>
              {capitalize(status)}
            </Badge>
          )
        },
        meta: {
          label: 'Status',
          variant: 'select',
          icon: CircleDotDashedIcon,
          options: PRODUCT_STATUS_LIST.map((status) => ({
            label: capitalize(status),
            value: status,
            icon: getProductStatusIcon(status),
          })),
        },
        size: 90,
        enableColumnFilter: true,
        enableSorting: false,
        enableHiding: true,
      },
      {
        id: 'inventory',
        header: 'Inventory',
        accessorKey: 'stock',
        cell: ({ row }) => {
          const inventory = row.getValue<number>('inventory')
          const variants = row.original.variants ?? []

          return (
            <div className="inline-block">
              <span
                className={
                  inventory < 10 ? 'text-destructive' : 'text-foreground'
                }
              >
                {inventory} in stock
              </span>{' '}
              <span>
                for {variants.length} variant
                {variants.length === 1 ? '' : 's'}
              </span>
            </div>
          )
        },
        size: 200,
        enableSorting: false,
        enableHiding: true,
      },
      {
        id: 'category',
        header: 'Category',
        accessorFn: (row) => row.category?.name ?? null,
        cell: ({ row }) => row.getValue('category') ?? '-',
        size: 90,
        enableSorting: false,
        enableHiding: true,
      },
      {
        id: 'type',
        header: 'Type',
        accessorFn: (row) => row.type?.name ?? null,
        cell: ({ row }) => row.getValue('type') ?? '-',
        ...(productTypes.length > 0
          ? {
              meta: {
                label: 'Type',
                variant: 'select',
                icon: ShapesIcon,
                options: productTypes.map((type) => ({
                  value: type.name,
                  label: capitalize(type.name),
                })),
              },
              enableColumnFilter: true,
            }
          : {}),
        size: 90,
        enableSorting: false,
        enableHiding: true,
      },
      {
        id: 'vendor',
        header: 'Vendor',
        accessorFn: (row) => row.vendor?.name ?? null,
        cell: ({ row }) => row.getValue('vendor') ?? '-',
        ...(vendors.length > 0
          ? {
              meta: {
                label: 'Vendor',
                variant: 'select',
                icon: ContainerIcon,
                options: vendors.map((vendor) => ({
                  value: vendor.name,
                  label: capitalize(vendor.name),
                })),
              },
              enableColumnFilter: true,
            }
          : {}),
        size: 90,
        enableSorting: false,
        enableHiding: true,
      },
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
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <MemoizedProductTableRowAction product={row.original} />
        ),
        size: 60,
        enableHiding: false,
        enableSorting: false,
      },
    ],
    [productTypes, vendors],
  )

  return { columns }
}
