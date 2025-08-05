import {
  CUSTOMER_ACCOUNT_BADGE_STYLES,
  CUSTOMER_ACCOUNT_ICONS,
} from './constants'
import type { CustomerAccount } from '@/core/types'

export function getCustomerAccountIcon(status: CustomerAccount) {
  return CUSTOMER_ACCOUNT_ICONS[status]
}

export function getCustomerAccountBadgeStyle(account: CustomerAccount) {
  return CUSTOMER_ACCOUNT_BADGE_STYLES[account]
}
