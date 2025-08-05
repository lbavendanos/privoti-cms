import { toast } from '@/components/ui/toast'
import { usePrompt } from '@/hooks/use-prompt'
import { useCallback } from 'react'
import { isFetchError } from '@/lib/fetcher'
import type { Customer } from '@/core/types'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { EllipsisIcon, PencilIcon, TrashIcon } from 'lucide-react'

export function CustomerTableRowAction({ customer }: { customer: Customer }) {
  const prompt = usePrompt()

  const handleDelete = useCallback(async () => {
    const isConfirmed = await prompt({
      title: 'Are you sure?',
      description: (
        <>
          You are about to delete the customer <strong>{customer.name}</strong>.
          This action cannot be undone.
        </>
      ),
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })

    if (!isConfirmed) {
      return
    }

    // deleteCustomer(undefined, {
    //   onSuccess: () => {
    //     toast.success('Customer deleted successfully.')
    //   },
    //   onError: (error) => {
    //     if (isFetchError(error)) {
    //       if (error.status === 422) {
    //         toast.error(error.message)
    //       }
    //     }
    //   },
    // })
  }, [customer.name, prompt])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="shadow-none"
          aria-label="Edit item"
        >
          <EllipsisIcon size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link
              to="/customers/$customerId"
              params={{ customerId: `${customer.id}` }}
            >
              <PencilIcon size={16} aria-hidden="true" />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onSelect={handleDelete}
          >
            <TrashIcon size={16} aria-hidden="true" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
