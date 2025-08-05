import type { CustomerAccount } from '@/core/types'
import { UserCheckIcon, UserIcon, UserStarIcon } from 'lucide-react'

export const CUSTOMER_ACCOUNT_LIST = ['guest', 'registered'] as const
export const CUSTOMER_ACOOUNT_DEFAULT: CustomerAccount = 'guest'
export const CUSTOMER_ACCOUNT_ICONS: Record<
  CustomerAccount,
  typeof UserIcon | typeof UserStarIcon
> = {
  guest: UserIcon,
  registered: UserStarIcon,
}
export const CUSTOMER_ACCOUNT_BADGE_STYLES: Record<CustomerAccount, string> = {
  guest:
    'bg-neutral-100 border-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100',
  registered:
    'bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-800 dark:border-blue-700 dark:text-blue-100',
}
