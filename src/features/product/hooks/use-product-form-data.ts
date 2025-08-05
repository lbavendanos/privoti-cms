import { useCallback } from 'react'
import { blank } from '@/lib/utils'
import type { ProductFormSchema } from '../schemas/product-form-schema'

export function useProductFormData() {
  const makeFormData = useCallback(
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

  return { makeFormData }
}
