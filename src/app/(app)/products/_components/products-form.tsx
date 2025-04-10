'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { blank, uuid } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useTransition } from 'react'
import { createProduct, updateProduct } from '@/core/actions/product'
import type { Product } from '@/core/types'
import Link from 'next/link'
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MultipleTag } from '@/components/ui/multiple-tag'
import { LoadingButton } from '@/components/ui/loading-button'
import { SortableFileInput } from '@/components/ui/sortable-file-input'
import { ProductsTypeInput } from './products-type-input'
import { ProductsVendorInput } from './products-vendor-input'
import { ProductsStatusInput } from './products-status-input'
import { ProductsOptionsInput } from './products-options-input'
import { ProductsVariantsInput } from './products-variants-input'
import { ProductsCategoryInput } from './products-category-input'
import { ProductsCollectionsInput } from './products-collections-input'
import { ChevronLeft, CircleAlert, CircleCheckIcon } from 'lucide-react'

function getDirtyFields<T extends Record<string, unknown>>(
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

const MAX_FILE_SIZE = 1024 * 1024 // 1MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm']

const formSchema = z.object({
  status: z.enum(['draft', 'active', 'archived']),
  title: z.string().min(1, {
    message: 'Please provide a valid title.',
  }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()),
  media: z.array(
    z.object({
      uuid: z.string(),
      id: z.string().optional(),
      name: z.string(),
      type: z.string(),
      url: z.string(),
      rank: z.number(),
      file: z
        .instanceof(File)
        .refine(
          (file) =>
            ALLOWED_IMAGE_TYPES.includes(file.type) ||
            ALLOWED_VIDEO_TYPES.includes(file.type),
          {
            message:
              'The file must be an image (JPG, PNG, WEBP) or a video (MP4, WEBM)',
          },
        )
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          message: 'The file must not be larger than 1MB',
        })
        .optional(),
    }),
  ),
  options: z.array(
    z.object({
      uuid: z.string(),
      id: z.string().optional(),
      name: z.string(),
      values: z.array(z.string()),
    }),
  ),
  variants: z.array(
    z.object({
      uuid: z.string(),
      id: z.string().optional(),
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
      options: z.array(
        z.object({
          value: z.string(),
        }),
      ),
    }),
  ),
  category: z
    .object({
      id: z.string(),
      name: z.string(),
      parentId: z.string().nullable(),
    })
    .nullable()
    .optional(),
  type: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
  vendor: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
  collections: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
      }),
    )
    .optional(),
})

function makeDefaultValues(
  product?: Product | null,
): z.infer<typeof formSchema> {
  return {
    status: product ? product.status : 'draft',
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
}

function makeFormData(values: z.infer<typeof formSchema>): FormData {
  const formData = new FormData()

  Object.keys(values).forEach((key) => {
    const typedKey = key as keyof typeof values

    if (typedKey === 'media') {
      const media = values[typedKey]

      if (blank(media)) {
        formData.append('media', '')
      } else {
        media?.forEach((media, mediaIndex) => {
          if (media.id) {
            formData.append(`media[${mediaIndex}][id]`, media.id)
          }
          if (media.file) {
            formData.append(`media[${mediaIndex}][file]`, media.file)
          }
          formData.append(`media[${mediaIndex}][rank]`, `${media.rank}`)
        })
      }

      return
    }

    if (typedKey === 'options') {
      const options = values[typedKey]

      if (blank(options)) {
        formData.append('options', '')
      } else {
        options?.forEach((option, optionIndex) => {
          if (option.id) {
            formData.append(`options[${optionIndex}][id]`, option.id)
          }
          formData.append(`options[${optionIndex}][name]`, option.name)

          option.values?.forEach((value, valueIndex) => {
            formData.append(
              `options[${optionIndex}][values][${valueIndex}]`,
              value,
            )
          })
        })
      }

      return
    }

    if (typedKey === 'variants') {
      const variants = values[typedKey]

      if (blank(variants)) {
        formData.append('variants', '')
      } else {
        variants?.forEach((variant, variantIndex) => {
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

          variant.options?.forEach((option, optionIndex) => {
            formData.append(
              `variants[${variantIndex}][options][${optionIndex}][value]`,
              option.value,
            )
          })
        })
      }

      return
    }

    if (typedKey === 'category') {
      const category = values[typedKey]

      formData.append('category_id', category ? category.id : '')

      return
    }

    if (typedKey === 'type') {
      const type = values[typedKey]

      formData.append('type_id', type ? type.id : '')

      return
    }

    if (typedKey === 'vendor') {
      const vendor = values[typedKey]

      formData.append('vendor_id', vendor ? vendor.id : '')

      return
    }

    if (typedKey === 'collections') {
      const collections = values[typedKey]

      collections?.forEach((collection, collectionIndex) => {
        formData.append(`collections[${collectionIndex}]`, collection.id)
      })

      return
    }

    if (typedKey === 'tags') {
      const tags = values[typedKey]

      tags?.forEach((tag, tagIndex) => {
        formData.append(`tags[${tagIndex}]`, tag)
      })

      return
    }

    formData.append(key, values[typedKey] as string)
  })

  return formData
}

type ProductsFormProps = {
  product?: Product
}

export function ProductsForm({ product }: ProductsFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: makeDefaultValues(product),
  })

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      const dirtyValues = getDirtyFields<typeof formSchema._type>(
        form.formState.dirtyFields,
        values,
      )

      const formData = makeFormData(dirtyValues as Required<typeof dirtyValues>)

      startTransition(async () => {
        const response = product
          ? await updateProduct(product.id, formData)
          : await createProduct(formData)

        if (response.isServerError || response.isUnknown) {
          toast({
            variant: 'destructive',
            description: response.message,
          })
        }

        if (response.isClientError) {
          toast({
            description: (
              <p className="grow text-sm">
                <CircleAlert
                  className="-mt-0.5 me-3 inline-flex text-red-500"
                  size={16}
                  aria-hidden="true"
                />
                {response.message}
              </p>
            ),
          })
        }

        if (response.isSuccess) {
          toast({
            description: (
              <p className="grow text-sm">
                <CircleCheckIcon
                  className="-mt-0.5 me-3 inline-flex text-emerald-500"
                  size={16}
                  aria-hidden="true"
                />
                Product {product ? 'updated' : 'created'} successfully.
              </p>
            ),
          })

          form.reset(makeDefaultValues(response.data))

          if (response.data) {
            queryClient.setQueryData(
              ['product-detail', { id: `${response.data.id}` }],
              response.data,
            )

            queryClient.invalidateQueries({ queryKey: ['product-list'] })

            if (!product) {
              router.replace(`/products/${response.data.id}`)
            }
          }
        }
      })
    },
    [product, form, queryClient, router, toast],
  )

  return (
    <Form {...form}>
      <form className="relative" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="container my-4 lg:my-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-10 md:col-start-2">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  asChild
                >
                  <Link href="/products">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  {product ? product.title : 'Create Product'}
                </h1>
              </div>
            </div>
            <div className="col-span-12 md:col-span-10 md:col-start-2 xl:col-span-7 xl:col-start-2">
              <div className="flex flex-col gap-6">
                <Card className="block xl:hidden">
                  <CardHeader>
                    <CardTitle>Status</CardTitle>
                    <CardDescription>
                      Set the status of the product to manage its visibility.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ProductsStatusInput {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Details</CardTitle>
                    <CardDescription>
                      Provide detailed information about the product, including
                      specifications, features, and other relevant details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Winter Jacket" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subtitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Subtitle{' '}
                              <span className="text-muted-foreground">
                                (optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Comfortable, warm, and stylish"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Description{' '}
                              <span className="text-muted-foreground">
                                (optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                className="min-h-32"
                                placeholder="This winter jacket is perfect for cold weather. It's comfortable, warm, and stylish."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Assets</CardTitle>
                    <CardDescription>
                      Upload images, videos, or other media to showcase the
                      product.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="media"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Media{' '}
                            <span className="text-muted-foreground">
                              (optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <SortableFileInput {...field} />
                          </FormControl>
                          {form.formState.errors.media?.map?.(
                            (media, index) => (
                              <p
                                key={index}
                                className="text-sm font-medium text-destructive"
                              >
                                {media?.file?.message}
                              </p>
                            ),
                          )}
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Options</CardTitle>
                    <CardDescription>
                      Add options to the product, such as size, color, or
                      material.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="options"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ProductsOptionsInput {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                {form.watch('options').length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Variants</CardTitle>
                      <CardDescription>
                        Add variants to the product, such as different sizes or
                        colors.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="variants"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <ProductsVariantsInput
                                options={form.getValues('options')}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            <div className="col-span-12 md:col-span-10 md:col-start-2 xl:col-span-3 xl:col-start-9">
              <div className="flex flex-col gap-6">
                <Card className="hidden xl:block">
                  <CardHeader>
                    <CardTitle>Status</CardTitle>
                    <CardDescription>
                      Set the status of the product to manage its visibility.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ProductsStatusInput {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Organize</CardTitle>
                    <CardDescription>
                      Categorize the product to make it easier to find.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Category{' '}
                              <span className="text-muted-foreground">
                                (optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <ProductsCategoryInput {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Type{' '}
                              <span className="text-muted-foreground">
                                (optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <ProductsTypeInput {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="vendor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Vendor{' '}
                              <span className="text-muted-foreground">
                                (optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <ProductsVendorInput {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="collections"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Collections{' '}
                              <span className="text-muted-foreground">
                                (optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <ProductsCollectionsInput {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Tags{' '}
                              <span className="text-muted-foreground">
                                (optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <MultipleTag
                                placeholder="Winter, Jacket, Warm, Stylish"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 z-10 border-t bg-white">
          <div className="container py-4">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-10 md:col-start-2">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/products">Discard</Link>
                  </Button>
                  <LoadingButton type="submit" loading={isPending}>
                    Save Product
                  </LoadingButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
