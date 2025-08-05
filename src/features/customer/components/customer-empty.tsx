import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CustomerProfileDialog } from './customer-profile-dialog'

export function CustomerEmpty() {
  const [open, setOpen] = useState(false)

  return (
    <div className="@container mx-auto my-4 size-full max-w-5xl px-4 lg:my-6">
      <div className="flex h-full flex-col gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Customers</h1>
        <div className="flex grow flex-col items-center justify-center gap-1 rounded-lg border border-dashed bg-white p-4 shadow-sm">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no customers
          </h3>
          <p className="text-muted-foreground text-sm">
            You can start managing your customers as soon as you add a customer.
          </p>
          <Button className="mt-4" onClick={() => setOpen(true)}>
            Add customer
          </Button>
          <CustomerProfileDialog open={open} onOpenChange={setOpen} />
        </div>
      </div>
    </div>
  )
}
