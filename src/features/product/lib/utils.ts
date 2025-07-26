import {
  PRODUCT_STATUS_ICONS,
  PRODUCT_STATUS_BADGE_STYLES,
  PRODUCT_STATUS_TEXT_STYLES,
} from './constants'
import type { ProductStatus } from '@/core/types'

export function getDirtyFields<T extends Record<string, unknown>>(
  dirtyFields: Partial<Record<keyof T, unknown>>,
  values: T,
): Partial<T> {
  return Object.keys(dirtyFields).reduce((dirtyValues, key) => {
    const typedKey = key as keyof T

    if (dirtyFields[typedKey]) {
      dirtyValues[typedKey] = values[typedKey]
    }

    return dirtyValues
  }, {} as Partial<T>)
}

export function getProductStatusIcon(status: ProductStatus) {
  return PRODUCT_STATUS_ICONS[status]
}

export function getProductStatusTextStyle(status: ProductStatus) {
  return PRODUCT_STATUS_TEXT_STYLES[status]
}

export function getProductStatusBadgeStyle(status: ProductStatus) {
  return PRODUCT_STATUS_BADGE_STYLES[status]
}
