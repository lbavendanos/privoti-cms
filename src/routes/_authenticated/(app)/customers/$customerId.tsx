import { createFileRoute } from '@tanstack/react-router'
import { makeCustomerQueryOptions } from '@/core/hooks/customer'
import { CustomerDetail } from '@/features/customer/components/customer-detail'
import { Loading } from '@/components/loading'

export const Route = createFileRoute(
  '/_authenticated/(app)/customers/$customerId',
)({
  loader: ({ context: { queryClient }, params: { customerId } }) => {
    queryClient.ensureQueryData(makeCustomerQueryOptions(Number(customerId)))
  },
  pendingComponent: Loading,
  component: CustomerDetail,
})
