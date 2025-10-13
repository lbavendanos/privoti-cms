import { formatDate } from '@/lib/utils'
import { useMemo, useState } from 'react'
import { useCustomerAddresses } from '@/core/hooks/customer-address'
import type { Customer } from '@/core/types'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ProfileDialog } from './profile-dialog'
import { AddressListDialog } from '../address/address-list-dialog'
import { EllipsisIcon } from 'lucide-react'

type ProfileSectionProps = {
  customer: Customer
}

export function ProfileSection({ customer }: ProfileSectionProps) {
  const {
    data: { data: addresses },
  } = useCustomerAddresses(customer.id)

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAddressesOpen, setIsAddressesOpen] = useState(false)

  const defaultAddress = useMemo(
    () => addresses.find((address) => address.default === true),
    [addresses],
  )

  return (
    <Card className="relative">
      <CardAction className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full shadow-none"
            >
              <EllipsisIcon size={16} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setIsProfileOpen(true)}>
              Edit contact information
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsAddressesOpen(true)}>
              Manage addresses
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardAction>
      <ProfileDialog
        customer={customer}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />
      <AddressListDialog
        customer={customer}
        open={isAddressesOpen}
        onOpenChange={setIsAddressesOpen}
      />
      <CardHeader>
        <CardTitle>Customer</CardTitle>
        <CardDescription>
          Manage customer information, including contact details and addresses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <p className="text-sm leading-none font-medium">Email</p>
            <p className="text-muted-foreground text-sm">{customer.email}</p>
          </div>
          <div className="grid gap-2">
            <p className="text-sm leading-none font-medium">Phone</p>
            <p className="text-muted-foreground text-sm">
              {customer.phone?.national ?? '-'}
            </p>
          </div>
          <div className="grid gap-2">
            <p className="text-sm leading-none font-medium">Date of Birth</p>
            <p className="text-muted-foreground text-sm">
              {customer.dob ? formatDate(customer.dob) : '-'}
            </p>
          </div>
          <div className="grid gap-2">
            <p className="text-sm leading-none font-medium">Default Address</p>
            <p className="text-muted-foreground text-sm">
              {defaultAddress ? defaultAddress.address1 : '-'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
