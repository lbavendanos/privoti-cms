import { toast } from '@/components/ui/toast'
import { usePrompt } from '@/hooks/use-prompt'
import { capitalize } from '@/lib/utils'
import { isFetchError } from '@/lib/fetcher'
import { useCallback, useMemo } from 'react'
import { getProductStatusIcon } from '../lib/utils'
import { useDeleteProduct, useUpdateProduct } from '@/core/hooks/product'
import { PRODUCT_STATUS_LIST } from '../lib/constants'
import type { Product } from '@/core/types'
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
import { TrashIcon, PencilIcon, EllipsisIcon } from 'lucide-react'

export function ProductTableRowAction({ product }: { product: Product }) {
  const prompt = usePrompt()
  const { mutate: updateProduct } = useUpdateProduct(product.id)
  const { mutate: deleteProduct } = useDeleteProduct(product.id)

  const handleStatusChange = useCallback(
    (status: string) => {
      updateProduct(
        { status },
        {
          onSuccess: () => {
            toast.success('Product updated successfully.')
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
    [updateProduct],
  )

  const handleDelete = useCallback(async () => {
    const isConfirmed = await prompt({
      title: 'Are you sure?',
      description: (
        <>
          You are about to delete the product <strong>{product.title}</strong>.
          This action cannot be undone.
        </>
      ),
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })

    if (!isConfirmed) {
      return
    }

    deleteProduct(undefined, {
      onSuccess: () => {
        toast.success('Product deleted successfully.')
      },
      onError: (error) => {
        if (isFetchError(error)) {
          if (error.status === 422) {
            toast.error(error.message)
          }
        }
      },
    })
  }, [product.title, prompt, deleteProduct])

  const statusMenuItems = useMemo(
    () =>
      PRODUCT_STATUS_LIST.filter((status) => status !== product.status).map(
        (status) => {
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
        },
      ),
    [product.status, handleStatusChange],
  )

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
              to="/products/$productId"
              params={{ productId: `${product.id}` }}
            >
              <PencilIcon size={16} aria-hidden="true" />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>{statusMenuItems}</DropdownMenuGroup>
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
