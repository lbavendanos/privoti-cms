import type { Customer, CustomerAddress } from '@/core/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AddressForm } from './address-form'

type AddressDialogProps = {
  customer: Customer
  address?: CustomerAddress | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddressDialog({
  customer,
  address,
  open,
  onOpenChange,
}: AddressDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {address ? 'Edit address' : 'Create address'}
          </DialogTitle>
          <DialogDescription>
            {address
              ? 'Edit the address details below.'
              : 'Fill in the address details below to create a new address.'}
          </DialogDescription>
        </DialogHeader>
        <AddressForm
          customer={customer}
          address={address}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
