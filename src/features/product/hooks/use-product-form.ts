import { blank, uuid } from '@/lib/utils'
import { useCallback } from 'react'
import { PRODUCT_STATUS_DEFAULT } from '../lib/constants'
import type { Product } from '@/core/types'
import type { ProductFormSchema } from '../schemas/product-form-schema'

export function useProductForm() {
  const createDefaultValues = useCallback(
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

  const createFormData = useCallback(
    (values: Partial<ProductFormSchema>): FormData => {
      const formData = new FormData()

      const appendArrayField = <TData>(
        name: string,
        data: TData[] = [],
        callback: (item: TData, index: number) => void,
      ) => {
        if (blank(data)) {
          formData.append(name, '')
        } else {
          data.forEach(callback)
        }
      }

      Object.keys(values).forEach((key) => {
        const typedKey = key as keyof typeof values

        switch (typedKey) {
          case 'media':
            appendArrayField('media', values.media, (mediaItem, mediaIndex) => {
              if (mediaItem.id) {
                formData.append(`media[${mediaIndex}][id]`, mediaItem.id)
              }
              if (mediaItem.file) {
                formData.append(`media[${mediaIndex}][file]`, mediaItem.file)
              }
              formData.append(`media[${mediaIndex}][rank]`, `${mediaItem.rank}`)
            })
            break

          case 'options':
            appendArrayField(
              'options',
              values.options,
              (option, optionIndex) => {
                if (option.id) {
                  formData.append(`options[${optionIndex}][id]`, option.id)
                }
                formData.append(`options[${optionIndex}][name]`, option.name)

                option.values.forEach((value, valueIndex) => {
                  formData.append(
                    `options[${optionIndex}][values][${valueIndex}]`,
                    value,
                  )
                })
              },
            )
            break

          case 'variants':
            appendArrayField(
              'variants',
              values.variants,
              (variant, variantIndex) => {
                if (variant.id) {
                  formData.append(`variants[${variantIndex}][id]`, variant.id)
                }
                formData.append(`variants[${variantIndex}][name]`, variant.name)
                formData.append(
                  `variants[${variantIndex}][price]`,
                  `${variant.price}`,
                )
                formData.append(
                  `variants[${variantIndex}][quantity]`,
                  `${variant.quantity}`,
                )

                variant.options.forEach((option, optionIndex) => {
                  formData.append(
                    `variants[${variantIndex}][options][${optionIndex}][value]`,
                    option.value,
                  )
                })
              },
            )
            break

          case 'category':
            formData.append('category_id', values.category?.id ?? '')
            break

          case 'type':
            formData.append('type_id', values.type?.id ?? '')
            break

          case 'vendor':
            formData.append('vendor_id', values.vendor?.id ?? '')
            break

          case 'collections':
            appendArrayField(
              'collections',
              values.collections ?? [],
              (collection, collectionIndex) => {
                formData.append(
                  `collections[${collectionIndex}]`,
                  collection.id,
                )
              },
            )
            break

          case 'tags':
            appendArrayField('tags', values.tags ?? [], (tag, tagIndex) => {
              formData.append(`tags[${tagIndex}]`, tag)
            })
            break

          default:
            formData.append(key, values[typedKey] as string)
        }
      })

      return formData
    },
    [],
  )

  return { createDefaultValues, createFormData }
}
