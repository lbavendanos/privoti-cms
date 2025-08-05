import type { ProductStatus } from '@/core/types'
import { CircleCheckIcon, CircleDashedIcon, CircleDotIcon } from 'lucide-react'

export const PRODUCT_STATUS_LIST = ['draft', 'active', 'archived'] as const
export const PRODUCT_STATUS_DEFAULT: ProductStatus = 'draft'
export const PRODUCT_STATUS_ICONS: Record<
  ProductStatus,
  typeof CircleCheckIcon | typeof CircleDotIcon | typeof CircleDashedIcon
> = {
  active: CircleCheckIcon,
  draft: CircleDotIcon,
  archived: CircleDashedIcon,
}
export const PRODUCT_STATUS_TEXT_STYLES: Record<ProductStatus, string> = {
  active: 'text-emerald-400  dark:text-emerald-100',
  draft: 'text-amber-400 dark:text-amber-100',
  archived: 'text-neutral-400 dark:text-neutral-100',
}
export const PRODUCT_STATUS_BADGE_STYLES: Record<ProductStatus, string> = {
  active:
    'bg-emerald-100 border-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:border-emerald-700 dark:text-emerald-100',
  draft:
    'bg-amber-100 border-amber-200 text-amber-800 dark:bg-amber-800 dark:border-amber-700 dark:text-amber-100',
  archived:
    'bg-neutral-100 border-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100',
}
