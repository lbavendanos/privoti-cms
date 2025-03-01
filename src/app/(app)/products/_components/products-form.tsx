'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProduct } from '@/core/actions/product'
import { useState, useTransition } from 'react'
import { type ProductType } from '@/core/types'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MultipleTag } from '@/components/ui/multiple-tag'
import { LoadingButton } from '@/components/ui/loading-button'
import { ProductTypeInput } from './product-type-input'
import { SortableFileInput } from '@/components/ui/sortable-file-input'
import { MultipleSelector, Option } from '@/components/ui/multiple-selector'
import { ProductsOptionsInput } from './products-options-input'
import { ProductsVariantsInput } from './products-variants-input'
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

const CATEGORIES: Option[] = [
  { label: 'Shirts', value: 'shirts' },
  { label: 'Pants', value: 'pants' },
  { label: 'Jackets', value: 'jackets' },
  { label: 'Shoes', value: 'shoes' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Hats', value: 'hats' },
]

const COLLECTIONS: Option[] = [
  { label: 'Latest Drops', value: 'latest-drops' },
  { label: 'Best Sellers', value: 'best-sellers' },
  { label: 'Sale', value: 'sale' },
  { label: 'Summer Collection', value: 'summer-collection' },
  { label: 'Winter Collection', value: 'winter-collection' },
]

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Please provide a valid title.',
  }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
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
  category_id: z.string().optional(),
  type_id: z.string().optional(),
  vendor_id: z.string().optional(),
})

function StatusDot({ className }: { className?: string }) {
  return (
    <svg
      width="8"
      height="8"
      fill="currentColor"
      viewBox="0 0 8 8"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="4" cy="4" r="4" />
    </svg>
  )
}

export function ProductsForm({
  typesPromise,
}: {
  typesPromise: Promise<ProductType[]>
}) {
  const [isPending, startTransition] = useTransition()
  const [tags, setTags] = useState<string[]>([])

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      media: [],
      options: [],
      variants: [],
      status: 'draft',
      category_id: '',
      type_id: '',
      vendor_id: '',
    },
  })

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
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                              <SelectItem value="draft">
                                <span className="flex items-center gap-2">
                                  <StatusDot className="text-amber-500" />
                                  <span className="truncate">Draft</span>
                                </span>
                              </SelectItem>
                              <SelectItem value="active">
                                <span className="flex items-center gap-2">
                                  <StatusDot className="text-emerald-600" />
                                  <span className="truncate">Active</span>
                                </span>
                              </SelectItem>
                              <SelectItem value="archived">
                                <span className="flex items-center gap-2">
                                  <StatusDot className="text-gray-500" />
                                  <span className="truncate">Archived</span>
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
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
                      <div className="space-y-2">
                        <Label>
                          Categories{' '}
                          <span className="text-muted-foreground">
                            (optional)
                          </span>
                        </Label>
                        <MultipleSelector
                          defaultOptions={CATEGORIES}
                          badgeVariant="secondary"
                          commandProps={{
                            label: 'Jackets',
                          }}
                          placeholder="Jackets"
                          emptyIndicator={
                            <p className="text-center text-sm">
                              No results found
                            </p>
                          }
                          hidePlaceholderWhenSelected
                          hideClearAllButton
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="type_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Type{' '}
                              <span className="text-muted-foreground">
                                (optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <ProductTypeInput
                                typesPromise={typesPromise}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-2">
                        <Label>
                          Collections{' '}
                          <span className="text-muted-foreground">
                            (optional)
                          </span>
                        </Label>
                        <MultipleSelector
                          defaultOptions={COLLECTIONS}
                          badgeVariant="secondary"
                          commandProps={{
                            label: 'Select collections',
                          }}
                          placeholder="Winter Collection"
                          emptyIndicator={
                            <p className="text-center text-sm">
                              No results found
                            </p>
                          }
                          hidePlaceholderWhenSelected
                          hideClearAllButton
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>
                          Tags{' '}
                          <span className="text-muted-foreground">
                            (optional)
                          </span>
                        </Label>
                        <MultipleTag
                          value={tags}
                          onChange={setTags}
                          placeholder="Winter, Jacket, Warm, Stylish"
                        />
                      </div>
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
