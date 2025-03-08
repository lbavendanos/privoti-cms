'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { getVendors } from '@/core/actions/vendor'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProduct } from '@/core/actions/product'
import { getCollections } from '@/core/actions/collection'
import { useCallback, useTransition } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MultipleTag } from '@/components/ui/multiple-tag'
import { LoadingButton } from '@/components/ui/loading-button'
import { MultipleSelector } from '@/components/ui/multiple-selector'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { SortableFileInput } from '@/components/ui/sortable-file-input'
import { ProductsTypeInput } from './products-type-input'
import { ProductsStatusInput } from './products-status-input'
import { ProductsOptionsInput } from './products-options-input'
import { ProductsVariantsInput } from './products-variants-input'
import { ProductsCategoryInput } from './products-category-input'
import { ChevronLeft } from 'lucide-react'

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

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Please provide a valid title.',
  }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()),
  media: z.array(
    z.object({
      id: z.string(),
      file: z.any(),
      url: z.string(),
      rank: z.number(),
    }),
  ),
  options: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      values: z.array(z.string()),
    }),
  ),
  variants: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
      options: z.array(
        z.object({
          id: z.string(),
          value: z.string(),
        }),
      ),
    }),
  ),
  status: z.enum(['draft', 'active', 'archived']),
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
      label: z.string(),
      value: z.string(),
    })
    .nullable()
    .optional(),
  collections: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        disable: z.boolean().optional(),
      }),
    )
    .optional(),
})

export function ProductsForm() {
  const [isPending, startTransition] = useTransition()

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      tags: [],
      media: [],
      options: [],
      variants: [],
      status: 'draft',
      category: null,
      type: null,
      vendor: null,
      collections: [],
    },
  })

  const onSearchVendor = useCallback(async (value: string) => {
    const vendors = await getVendors({ search: value, fields: 'id,name' })

    return vendors.map((vendor) => ({
      label: vendor.name,
      value: vendor.id.toString(),
    }))
  }, [])

  const onSearchCollection = useCallback(async (value: string) => {
    const collections = await getCollections({
      search: value,
      fields: 'id,title',
    })

    return collections.map((collection) => ({
      label: collection.title,
      value: collection.id.toString(),
    }))
  }, [])

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const dirtyValues = getDirtyFields<typeof formSchema._type>(
      form.formState.dirtyFields,
      values,
    )
    const formData = new FormData()

    Object.keys(dirtyValues).forEach((key) => {
      const typedKey = key as keyof typeof dirtyValues

      if (typedKey === 'media') {
        const media = dirtyValues[typedKey]

        media?.forEach((media, mediaIndex) => {
          formData.append(`media[${mediaIndex}][id]`, media.id)
          formData.append(`media[${mediaIndex}][file]`, media.file)
          formData.append(`media[${mediaIndex}][rank]`, media.rank.toString())
        })

        return
      }

      if (typedKey === 'options') {
        const options = dirtyValues[typedKey]

        options?.forEach((option, optionIndex) => {
          formData.append(`options[${optionIndex}][id]`, option.id)
          formData.append(`options[${optionIndex}][name]`, option.name)

          option.values?.forEach((value, valueIndex) => {
            formData.append(
              `options[${optionIndex}][values][${valueIndex}]`,
              value,
            )
          })
        })

        return
      }

      if (typedKey === 'variants') {
        const variants = dirtyValues[typedKey]

        variants?.forEach((variant, variantIndex) => {
          formData.append(`variants[${variantIndex}][id]`, variant.id)
          formData.append(`variants[${variantIndex}][name]`, variant.name)
          formData.append(
            `variants[${variantIndex}][price]`,
            variant.price.toString(),
          )
          formData.append(
            `variants[${variantIndex}][quantity]`,
            variant.quantity.toString(),
          )

          variant.options?.forEach((option, optionIndex) => {
            formData.append(
              `variants[${variantIndex}][options][${optionIndex}][id]`,
              option.id,
            )
            formData.append(
              `variants[${variantIndex}][options][${optionIndex}][value]`,
              option.value,
            )
          })
        })

        return
      }

      if (typedKey === 'category') {
        const category = dirtyValues[typedKey]

        formData.append('category_id', category ? category.id : '')

        return
      }

      if (typedKey === 'type') {
        const type = dirtyValues[typedKey]

        formData.append('type_id', type ? type.id : '')

        return
      }

      if (typedKey === 'vendor') {
        const vendor = dirtyValues[typedKey]

        formData.append('vendor_id', vendor ? vendor.value : '')

        return
      }

      if (typedKey === 'collections') {
        const collections = dirtyValues[typedKey]

        collections?.forEach((collection, collectionIndex) => {
          formData.append(`collections[${collectionIndex}]`, collection.value)
        })

        return
      }

      if (typedKey === 'tags') {
        const tags = dirtyValues[typedKey]

        tags?.forEach((tag, tagIndex) => {
          formData.append(`tags[${tagIndex}]`, tag)
        })

        return
      }

      formData.append(key, dirtyValues[typedKey] as string)
    })

    startTransition(async () => {
      const state = await createProduct(null, formData)

      if (state.isClientError || state.isServerError) {
        toast({
          variant: 'destructive',
          description: state.message,
        })
      }

      if (state.isSuccess) {
        toast({
          description: 'Product created successfully.',
        })

        form.reset()
      }
    })
  }

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
                  Create Product
                </h1>
              </div>
            </div>
            <div className="col-span-12 md:col-span-10 md:col-start-2 xl:col-span-7 xl:col-start-2">
              <div className="flex flex-col gap-6">
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
                          <FormMessage />
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
                <Card>
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
                              <SearchableSelect
                                emptyIndicator="No vendors found"
                                onSearch={onSearchVendor}
                                {...field}
                              />
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
                              <MultipleSelector
                                badgeVariant="secondary"
                                placeholder="Winter Collection"
                                emptyIndicator="No collections found"
                                loadingIndicator={
                                  <div className="w-full py-6 text-center text-sm text-muted-foreground">
                                    Loading...
                                  </div>
                                }
                                hidePlaceholderWhenSelected={true}
                                hideClearAllButton={true}
                                triggerSearchOnFocus={true}
                                onSearch={onSearchCollection}
                                {...field}
                              />
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
