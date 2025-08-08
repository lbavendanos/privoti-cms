import { useCustomer } from '@/core/hooks/customer'
import { getRouteApi } from '@tanstack/react-router'
import { capitalize, formatDate } from '@/lib/utils'
import { getCustomerAccountBadgeStyle } from '../lib/utils'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ChevronLeft, EllipsisIcon } from 'lucide-react'

const route = getRouteApi('/_authenticated/(app)/customers/$customerId')

export function CustomerDetail() {
  const { customerId } = route.useParams()
  const { data: customer } = useCustomer(Number(customerId))

  return (
    <div className="relative block">
      <div className="@container mx-auto my-4 grid max-w-5xl grid-cols-12 gap-6 px-4 lg:my-6">
        <div className="col-span-12">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
              <Link
                from="/customers/$customerId"
                to="/customers"
                params={{ customerId: `${customer.id}` }}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="flex-1 shrink-0 text-xl font-semibold tracking-tight whitespace-nowrap sm:grow-0">
              {customer.name}
            </h1>
            <Badge className={getCustomerAccountBadgeStyle(customer.account)}>
              {capitalize(customer.account)}
            </Badge>
          </div>
        </div>
        <div className="col-span-12 @4xl:col-span-8">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  This section provides a summary of the customer's activity,
                  including total amount spent and number of orders.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-10 items-center space-x-4">
                  <div className="flex flex-1 flex-col gap-y-1">
                    <p className="text-muted-foreground text-sm leading-none">
                      Amount spent
                    </p>
                    <p className="font-medium">0</p>
                  </div>
                  <Separator orientation="vertical" />
                  <div className="flex flex-1 flex-col gap-y-1">
                    <p className="text-muted-foreground text-sm leading-none">
                      Orders
                    </p>
                    <p className="font-medium">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  View the customer's order history, including details of past
                  purchases and order statuses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-20 items-center justify-center border-2 border-dashed">
                  <p className="text-muted-foreground text-sm">
                    This customer has not placed any orders yet.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button type="button" variant="outline">
                  View all oders
                </Button>
                <Button type="button">Create order</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        <div className="col-span-12 @4xl:col-span-4 @4xl:col-start-9">
          <div className="flex flex-col gap-6">
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
                    <DropdownMenuItem>
                      Edit contact information
                    </DropdownMenuItem>
                    <DropdownMenuItem>Manage addresses</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
                <CardDescription>
                  Manage customer information, including contact details and
                  addresses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <p className="text-sm leading-none font-medium">Email</p>
                    <p className="text-muted-foreground text-sm">
                      {customer.email}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-sm leading-none font-medium">Phone</p>
                    <p className="text-muted-foreground text-sm">
                      {customer.phone ?? '-'}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-sm leading-none font-medium">
                      Date of Birth
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {customer.dob ? formatDate(customer.dob) : '-'}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-sm leading-none font-medium">
                      Default Address
                    </p>
                    <p className="text-muted-foreground text-sm">-</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
