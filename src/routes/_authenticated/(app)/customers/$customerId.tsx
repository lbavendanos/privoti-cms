import { createFileRoute } from '@tanstack/react-router'
import { makeCustomerQueryOptions } from '@/core/hooks/customer'
import { makeCustomerAddressesQueryOptions } from '@/core/hooks/customer-address'
import { Loading } from '@/components/loading'
import { CustomerDetail } from '@/features/customer/components/customer-detail'

export const Route = createFileRoute(
  '/_authenticated/(app)/customers/$customerId',
)({
  loader: ({ context: { queryClient }, params: { customerId } }) => {
    queryClient.ensureQueryData(makeCustomerQueryOptions(Number(customerId)))
    queryClient.ensureQueryData(
      makeCustomerAddressesQueryOptions(Number(customerId)),
    )
  },
  pendingComponent: Loading,
  component: CustomerDetail,
})
