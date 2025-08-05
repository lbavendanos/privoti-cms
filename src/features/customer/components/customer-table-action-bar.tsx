import { toast } from '@/components/ui/toast'
import { usePrompt } from '@/hooks/use-prompt'
import { useCallback } from 'react'
import { isFetchError } from '@/lib/fetcher'
import { useDeleteCustomers } from '@/core/hooks/customer'
import type { Table } from '@tanstack/react-table'
import type { Customer } from '@/core/types'
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from '@/components/data-table/data-table-action-bar'
import { Separator } from '@/components/ui/separator'
import { Trash2Icon } from 'lucide-react'

type CustomerTableActionBarProps = {
  table: Table<Customer>
}

export function CustomerTableActionBar({ table }: CustomerTableActionBarProps) {
  const prompt = usePrompt()
  const { mutate: deleteCustomers, isPending: isDeletePending } =
    useDeleteCustomers()

  const handleDelete = useCallback(async () => {
    const selectedRows = table.getSelectedRowModel().rows
    const selectedCustomerIds = selectedRows.map((row) => row.original.id)
    const isConfirmed = await prompt({
      title: 'Are you absolutely sure?',
      description: (
        <>
          This will permanently delete <strong>{selectedRows.length}</strong>{' '}
          selected {selectedRows.length > 1 ? 'customers' : 'customer'}. This
          action cannot be undone.
        </>
      ),
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })

    if (!isConfirmed) {
      return
    }

    deleteCustomers(selectedCustomerIds, {
      onSuccess: () => {
        toast.success(
          `Deleted ${selectedRows.length} selected ${
            selectedRows.length > 1 ? 'customers' : 'customer'
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
  }, [table, prompt, deleteCustomers])

  return (
    <DataTableActionBar table={table}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete customers"
          isPending={isDeletePending}
          onClick={handleDelete}
        >
          <Trash2Icon />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  )
}
