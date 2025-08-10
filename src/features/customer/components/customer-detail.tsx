import { useCustomer } from '@/core/hooks/customer'
import { getRouteApi } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ChevronLeft } from 'lucide-react'
import { CustomerAccountBadge } from './customer-account-badge'
import { CustomerProfileSection } from './customer-profile-section'

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
            <CustomerAccountBadge account={customer.account} />
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
            <CustomerProfileSection customer={customer} />
          </div>
        </div>
      </div>
    </div>
  )
}
