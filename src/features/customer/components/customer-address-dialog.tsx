import type { Customer } from '@/core/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type CustomerAddressDialogProps = {
  customer?: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerAddressDialog({
  customer,
  open,
  onOpenChange,
}: CustomerAddressDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Addresses</DialogTitle>
          <DialogDescription>
            Manage the customer's addresses below.
          </DialogDescription>
        </DialogHeader>
        {/* <CustomerProfileForm */}
        {/*   customer={customer} */}
        {/*   onSuccess={() => onOpenChange(false)} */}
        {/*   onCancel={() => onOpenChange(false)} */}
        {/* /> */}
      </DialogContent>
    </Dialog>
  )
}
