import { blank } from '@/lib/utils'
import { getRouteApi } from '@tanstack/react-router'
import { useCustomers } from '@/core/hooks/customer'
import { useDeferredValue, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CustomerEmpty } from './customer-empty'
import { CustomerTable } from './customer-table'
import { ProfileDialog } from './profile/profile-dialog'
import { PlusIcon } from 'lucide-react'

const route = getRouteApi('/_authenticated/(app)/customers/')

export function CustomerList() {
  const searchParams = route.useSearch()
  const deferredSearchParams = useDeferredValue(searchParams)
  const {
    data: {
      data: customers,
      meta: { total: customerCount },
    },
  } = useCustomers(deferredSearchParams)

  const [open, setOpen] = useState(false)

  if (blank(deferredSearchParams) && customerCount === 0)
    return <CustomerEmpty />

  return (
    <div className="@container mx-auto my-4 size-full max-w-5xl px-4 lg:my-6">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">Customers</h1>
          <Button
            className="ml-auto"
            variant="outline"
            onClick={() => setOpen(true)}
          >
            <PlusIcon
              className="-ms-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Add customer
          </Button>
          <ProfileDialog open={open} onOpenChange={setOpen} />
        </div>
        <CustomerTable customers={customers} customerCount={customerCount} />
      </div>
    </div>
  )
}
