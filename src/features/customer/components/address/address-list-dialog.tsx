import { toast } from '@/components/ui/toast'
import { usePrompt } from '@/hooks/use-prompt'
import { isFetchError } from '@/lib/fetcher'
import { useCallback, useMemo, useState } from 'react'
import {
  useCustomerAddresses,
  useDeleteCustomerAddressOptimistic,
  useUpdateCustomerAddressDefaultOptimistic,
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

  const handleView = useCallback((address: CustomerAddress) => {
    setAddressSelected(address)
    setIsAddressOpen(true)
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Addresses</DialogTitle>
          <DialogDescription>
            Manage the customer's addresses below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-4">
          <p className="text-muted-foreground text-sm">
            {remainingAddressSlots > 0
              ? `You have ${remainingAddressSlots} ${remainingAddressSlots > 1 ? 'addresses' : 'address'} available to add.`
              : 'You have reached the address limit.'}
          </p>
          {addresses.length > 0 ? (
            <ItemGroup className="gap-y-2">
              {addresses.map((address) => (
                <div key={address.id} className="relative">
                  <Item variant="outline" asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-fit w-full justify-start"
                      disabled={address.id === -1}
                      onClick={() => {
                        handleView(address)
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
                            {address.district}, {address.city}, {address.state}
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
                      onView={handleView}
                    />
                  </ItemActions>
                </div>
              ))}
            </ItemGroup>
          ) : (
            <p className="text-sm">No addresses available.</p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {remainingAddressSlots > 0 && (
              <Button
                type="button"
                onClick={() => {
                  setAddressSelected(null)
                  setIsAddressOpen(true)
                }}
              >
                Create new address
              </Button>
            )}
          </div>
        </div>
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
  onView?: (address: CustomerAddress) => void
}

function AddressActionMenu({
  customer,
  address,
  onView,
}: AddressActionMenuProps) {
  const prompt = usePrompt()

  const { mutate: updateAddress } = useUpdateCustomerAddressDefaultOptimistic(
    customer.id,
    address.id,
  )
  const { mutate: deleteAddress } = useDeleteCustomerAddressOptimistic(
    customer.id,
    address.id,
  )

  const handleDefault = useCallback(() => {
    updateAddress(undefined, {
      onError: (error) => {
        if (isFetchError(error)) {
          if (error.status === 422) {
            toast.error(error.message)
          }
        }
      },
    })

    toast.success('Address has been set as default.')
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
          variant="ghost"
          className="rounded-full shadow-none"
          disabled={address.id === -1}
          aria-label="Open menu"
        >
          <EllipsisIcon size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => onView?.(address)}>
          <PencilIcon size={16} aria-hidden="true" />
          <span>Edit</span>
        </DropdownMenuItem>
        {!address.default && (
          <DropdownMenuItem onSelect={handleDefault}>
            <CircleCheck size={16} aria-hidden="true" />
            <span>Default</span>
          </DropdownMenuItem>
        )}
        {!address.default && (
          <DropdownMenuItem variant="destructive" onSelect={handleDelete}>
            <TrashIcon size={16} aria-hidden="true" />
            <span>Delete</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
