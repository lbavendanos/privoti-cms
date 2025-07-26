import { uuid } from '@/lib/utils'
import { useCallback } from 'react'
import { PRODUCT_STATUS_DEFAULT } from '../lib/constants'
import type { Product } from '@/core/types'
import type { ProductFormSchema } from '../schemas/product-form-schema'

export function useProductFormDefault() {
  const makeFormDefault = useCallback(
    (product?: Product | null): ProductFormSchema => {
      return {
        status: product ? product.status : PRODUCT_STATUS_DEFAULT,
        title: product?.title ?? '',
        subtitle: product?.subtitle ?? '',
        description: product?.description ?? '',
        tags: product?.tags ?? [],
        media: product?.media
          ? product.media
              .sort((a, b) => a.rank - b.rank)
              .map((media) => ({
                uuid: uuid(),
                id: `${media.id}`,
                name: media.name,
                type: media.type,
                url: media.url,
                rank: media.rank,
              }))
          : [],
        options:
          product?.options?.map((option) => ({
            uuid: uuid(),
            id: `${option.id}`,
            name: option.name,
            values: option.values?.map((value) => value.value) ?? [],
          })) ?? [],
        variants:
          product?.variants?.map((variant) => ({
            uuid: uuid(),
            id: `${variant.id}`,
            name: variant.name,
            price: variant.price,
            quantity: variant.quantity,
            options: variant.values?.map(({ value }) => ({ value })) ?? [],
          })) ?? [],
        category: product?.category
          ? {
              id: `${product.category.id}`,
              name: product.category.name,
              parentId: product.category.parent_id
                ? `${product.category.parent_id}`
                : null,
            }
          : null,
        type: product?.type
          ? { id: `${product.type.id}`, name: product.type.name }
          : null,
        vendor: product?.vendor
          ? { id: `${product.vendor.id}`, name: product.vendor.name }
          : null,
        collections: product?.collections
          ? product.collections.map((collection) => ({
              id: `${collection.id}`,
              title: collection.title,
            }))
          : [],
      }
    },
    [],
  )

  return { makeFormDefault }
}
