import type { Customer } from '@/core/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CustomerProfileForm } from './customer-profile-form'

type CustomerProfileDialogProps = {
  customer?: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerProfileDialog({
  customer,
  open,
  onOpenChange,
}: CustomerProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {customer ? 'Edit customer' : 'Create customer'}
          </DialogTitle>
          <DialogDescription>
            {customer
              ? 'Edit the customer details below.'
              : 'Fill in the customer details below to create a new customer.'}
          </DialogDescription>
        </DialogHeader>
        <CustomerProfileForm
          customer={customer}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
