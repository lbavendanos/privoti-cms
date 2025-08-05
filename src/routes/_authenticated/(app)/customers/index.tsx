import { createFileRoute } from '@tanstack/react-router'
import { customerSearchSchema } from '@/features/customer/schemas/customer-search-schema'
import { makeCustomersQueryOptions } from '@/core/hooks/customer'
import { Loading } from '@/components/loading'
import { CustomerList } from '@/features/customer/components/customer-list'

export const Route = createFileRoute('/_authenticated/(app)/customers/')({
  validateSearch: customerSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) => {
    queryClient.ensureQueryData(makeCustomersQueryOptions(deps))
  },
  pendingComponent: Loading,
  component: CustomerList,
})
