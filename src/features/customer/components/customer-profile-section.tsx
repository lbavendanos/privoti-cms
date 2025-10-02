import { useState } from 'react'
import { formatDate } from '@/lib/utils'
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
import { CustomerProfileDialog } from './customer-profile-dialog'
import { CustomerAddressDialog } from './customer-address-dialog'
import { EllipsisIcon } from 'lucide-react'

type CustomerProfileSectionProps = {
  customer: Customer
}

export function CustomerProfileSection({
  customer,
}: CustomerProfileSectionProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAddressOpen, setIsAddressOpen] = useState(false)

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
            <DropdownMenuItem onSelect={() => setIsAddressOpen(true)}>
              Manage addresses
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardAction>
      <CustomerProfileDialog
        customer={customer}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />
      <CustomerAddressDialog
        customer={customer}
        open={isAddressOpen}
        onOpenChange={setIsAddressOpen}
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
            <p className="text-muted-foreground text-sm">-</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
