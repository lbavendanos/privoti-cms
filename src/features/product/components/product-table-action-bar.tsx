import { toast } from '@/components/ui/toast'
import { usePrompt } from '@/hooks/use-prompt'
import { capitalize } from '@/lib/utils'
import { useCallback } from 'react'
import { isFetchError } from '@/lib/fetcher'
import { getProductStatusIcon } from '../lib/utils'
import { useDeleteProducts, useUpdateProducts } from '@/core/hooks/product'
import { PRODUCT_STATUS_LIST } from '../lib/constants'
import type { Table } from '@tanstack/react-table'
import type { Product, ProductStatus } from '@/core/types'
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from '@/components/data-table/data-table-action-bar'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { CircleDotDashedIcon, Trash2Icon } from 'lucide-react'

type ProductTableActionBarProps = {
  table: Table<Product>
}

export function ProductTableActionBar({ table }: ProductTableActionBarProps) {
  const prompt = usePrompt()
  const { mutate: updateProducts, isPending: isUpdatePending } =
    useUpdateProducts()
  const { mutate: deleteProducts, isPending: isDeletePending } =
    useDeleteProducts()

  const handleStatusChange = useCallback(
    (status: ProductStatus) => {
      const selectedRows = table.getSelectedRowModel().rows
      const items = selectedRows.map((row) => ({
        id: row.original.id,
        status,
      }))

      updateProducts(
        { items },
        {
          onSuccess: () => {
            toast.success(
              `Status updated to ${capitalize(status)} for ${selectedRows.length} selected ${
                selectedRows.length > 1 ? 'products' : 'product'
              }.`,
            )
          },
          onError: (error) => {
            if (isFetchError(error)) {
              if (error.status === 422) {
                toast.error(error.message)
              }
            }
          },
        },
      )
    },
    [table, updateProducts],
  )

  const handleDelete = useCallback(async () => {
    const selectedRows = table.getSelectedRowModel().rows
    const selectedProductIds = selectedRows.map((row) => row.original.id)
    const isConfirmed = await prompt({
      title: 'Are you absolutely sure?',
      description: (
        <>
          This will permanently delete <strong>{selectedRows.length}</strong>{' '}
          selected {selectedRows.length > 1 ? 'products' : 'product'}. This
          action cannot be undone.
        </>
      ),
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })

    if (!isConfirmed) {
      return
    }

    deleteProducts(selectedProductIds, {
      onSuccess: () => {
        toast.success(
          `Deleted ${selectedRows.length} selected ${
            selectedRows.length > 1 ? 'products' : 'product'
          }.`,
        )
      },
      onError: (error) => {
        if (isFetchError(error)) {
          if (error.status === 422) {
            toast.error(error.message)
          }
        }
      },
    })
  }, [table, prompt, deleteProducts])

  return (
    <DataTableActionBar table={table}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update status"
              isPending={isUpdatePending}
            >
              <CircleDotDashedIcon />
            </DataTableActionBarAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuGroup>
              <DropdownMenuGroup>
                {PRODUCT_STATUS_LIST.map((status) => {
                  const Icon = getProductStatusIcon(status)

                  return (
                    <DropdownMenuItem
                      key={status}
                      className="cursor-pointer"
                      onSelect={() => handleStatusChange(status)}
                    >
                      <Icon size={16} aria-hidden="true" />
                      <span>{capitalize(status)}</span>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete products"
          isPending={isDeletePending}
          onClick={handleDelete}
        >
          <Trash2Icon />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  )
}
