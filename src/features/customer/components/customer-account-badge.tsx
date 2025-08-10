import { capitalize } from '@/lib/utils'
import { getCustomerAccountBadgeStyle } from '../lib/utils'
import type { CustomerAccount } from '@/core/types'
import { Badge } from '@/components/ui/badge'

export function CustomerAccountBadge({
  account,
}: {
  account: CustomerAccount
}) {
  return (
    <Badge className={getCustomerAccountBadgeStyle(account)}>
      {capitalize(account)}
    </Badge>
  )
}
