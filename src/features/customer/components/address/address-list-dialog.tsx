import { toast } from '@/components/ui/toast'
import { usePrompt } from '@/hooks/use-prompt'
import { isFetchError } from '@/lib/fetcher'
import { useCallback, useMemo, useState } from 'react'
import {
  useCustomerAddresses,
  useDeleteCustomerAddressOptimistic,
  useUpdateCustomerAddress,
} from '@/core/hooks/customer-address'
import { CUSTOMER_ADDRESS_LIMIT } from '../../lib/constants'
import type { Customer, CustomerAddress } from '@/core/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AddressDialog } from './address-dialog'
import {
  Check,
  CircleCheck,
  EllipsisIcon,
  PencilIcon,
  TrashIcon,
} from 'lucide-react'

type AddressListDialogProps = {
  customer: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddressListDialog({
  customer,
  open,
  onOpenChange,
}: AddressListDialogProps) {
  const {
    data: { data: addresses },
  } = useCustomerAddresses(customer.id)

  const remainingAddressSlots = useMemo(
    () => CUSTOMER_ADDRESS_LIMIT - addresses.length,
    [addresses],
  )

  const [addressSelected, setAddressSelected] =
    useState<CustomerAddress | null>(null)
  const [isAddressOpen, setIsAddressOpen] = useState(false)

  const handleCreate = useCallback(() => {
    setAddressSelected(null)
    setIsAddressOpen(true)
  }, [])

  const handleEdit = useCallback((address: CustomerAddress) => {
    setAddressSelected(address)
    setIsAddressOpen(true)
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {addresses.length > 0 ? (
          <>
            <DialogHeader>
              <DialogTitle>Addresses</DialogTitle>
              <DialogDescription>
                {remainingAddressSlots > 0 ? (
                  <>
                    You have <strong>{remainingAddressSlots}</strong>{' '}
                    {remainingAddressSlots > 1 ? 'addresses' : 'address'}{' '}
                    available to add.
                  </>
                ) : (
                  'You have reached the address limit.'
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-y-4">
              <ItemGroup className="gap-y-2">
                {addresses.map((address) => (
                  <div key={address.id} className="relative">
                    <Item variant="outline" asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-fit w-full justify-start"
                        onClick={() => {
                          handleEdit(address)
                        }}
                      >
                        <ItemContent>
                          <ItemTitle>
                            {address.first_name} {address.last_name}
                          </ItemTitle>
                          <div className="flex flex-col items-start gap-y-1">
                            <span className="text-muted-foreground text-sm leading-none">
                              {address.address1}
                              {address.address2 && ` - ${address.address2}`}
                            </span>
                            <span className="text-muted-foreground text-sm leading-none">
                              {address.district}, {address.city},{' '}
                              {address.state}
                            </span>
                            <span className="text-muted-foreground text-sm leading-none">
                              {address.phone.mobile_dialing}
                            </span>
                          </div>
                        </ItemContent>
                      </Button>
                    </Item>
                    <ItemActions className="absolute top-0 right-0 gap-0.5">
                      {address.default && (
                        <Badge className="h-5 min-w-5 rounded-full px-1">
                          <Check />
                        </Badge>
                      )}
                      <AddressActionMenu
                        customer={customer}
                        address={address}
                        onEdit={handleEdit}
                      />
                    </ItemActions>
                  </div>
                ))}
              </ItemGroup>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                {remainingAddressSlots > 0 && (
                  <Button type="button" onClick={handleCreate}>
                    Create new address
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="hidden">
              <DialogTitle>Addresses</DialogTitle>
              <DialogDescription>
                You have not added any addresses yet.
              </DialogDescription>
            </DialogHeader>
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No Addresses Yet</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t created any addresses yet. Get started by
                  creating your first address.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button type="button" onClick={handleCreate}>
                  Create new address
                </Button>
              </EmptyContent>
            </Empty>
          </>
        )}
        <AddressDialog
          customer={customer}
          address={addressSelected}
          open={isAddressOpen}
          onOpenChange={setIsAddressOpen}
        />
      </DialogContent>
    </Dialog>
  )
}

type AddressActionMenuProps = {
  customer: Customer
  address: CustomerAddress
  onEdit?: (address: CustomerAddress) => void
}

function AddressActionMenu({
  customer,
  address,
  onEdit,
}: AddressActionMenuProps) {
  const prompt = usePrompt()

  const { mutate: updateAddress } = useUpdateCustomerAddress(
    customer.id,
    address.id,
  )
  const { mutate: deleteAddress } = useDeleteCustomerAddressOptimistic(
    customer.id,
    address.id,
  )

  const handleDefault = useCallback(() => {
    updateAddress(
      { default: true },
      {
        onSuccess: () => {
          toast.success('Address has been set as default.')
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
  }, [updateAddress])

  const handleDelete = useCallback(async () => {
    const isConfirmed = await prompt({
      title: 'Are you sure?',
      description: (
        <>
          You are about to delete the address{' '}
          <strong>{address.address1}</strong>. This action cannot be undone.
        </>
      ),
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })

    if (!isConfirmed) {
      return
    }

    deleteAddress(undefined, {
      onError: (error) => {
        if (isFetchError(error)) {
          if (error.status === 422) {
            toast.error(error.message)
          }
        }
      },
    })

    toast.success('Address deleted successfully.')
  }, [address.address1, prompt, deleteAddress])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="rounded-full shadow-none"
          variant="ghost"
          aria-label="Open menu"
        >
          <EllipsisIcon size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => onEdit?.(address)}>
          <PencilIcon size={16} aria-hidden="true" />
          <span>Edit</span>
        </DropdownMenuItem>
        {!address.default && (
          <DropdownMenuItem onSelect={handleDefault}>
            <CircleCheck size={16} aria-hidden="true" />
            <span>Default</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem variant="destructive" onSelect={handleDelete}>
          <TrashIcon size={16} aria-hidden="true" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
