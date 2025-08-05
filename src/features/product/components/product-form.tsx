import { toast } from '@/components/ui/toast'
import { pickFields } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { isFetchError } from '@/lib/fetcher'
import { productFormSchema } from '../schemas/product-form-schema'
import { useProductFormData } from '../hooks/use-product-form-data'
import { useProductFormDefault } from '../hooks/use-product-form-default'
import { useForm, useFormState } from 'react-hook-form'
import type { Product } from '@/core/types'
import type { ProductFormSchema } from '../schemas/product-form-schema'
import type { useCreateProduct, useUpdateProduct } from '@/core/hooks/product'
import { Link } from '@tanstack/react-router'
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
import { ProductTypeInput } from './product-type-input'
import { ProductVendorInput } from './product-vendor-input'
import { ProductStatusInput } from './product-status-input'
import { ProductOptionsInput } from './product-options-input'
import { ProductVariantsInput } from './product-variants-input'
import { ProductCategoryInput } from './product-category-input'
import { ProductCollectionsInput } from './product-collections-input'
import { ChevronLeft } from 'lucide-react'

type ProductFormProps = {
  product?: Product
  mutation:
    | ReturnType<typeof useCreateProduct>
    | ReturnType<typeof useUpdateProduct>
}

export function ProductForm({ product, mutation }: ProductFormProps) {
  const navigate = useNavigate()
  const { makeFormDefault } = useProductFormDefault()
  const { makeFormData } = useProductFormData()
  const { mutate, isPending } = mutation

  const form = useForm<ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
    defaultValues: makeFormDefault(product),
  })
  const { dirtyFields } = useFormState({ control: form.control })

  const handleSubmit = useCallback(
    (values: ProductFormSchema) => {
      const dirtyValues = pickFields(values, dirtyFields)
      const formData = makeFormData(dirtyValues)

      mutate(formData, {
        onSuccess: (response) => {
          form.reset(makeFormDefault(response))

          toast.success(
            `Product ${product ? 'updated' : 'created'} successfully`,
          )

          if (!product) {
            navigate({
              from: '/products/create',
              to: '/products/$productId',
              params: { productId: `${response.id}` },
            })
          }
        },
        onError: (error) => {
          if (isFetchError(error)) {
            if (error.status === 422) {
              toast.error(error.message)
            }
          }
        },
      })
    },
    [
      product,
      form,
      dirtyFields,
      makeFormData,
      makeFormDefault,
      mutate,
      navigate,
    ],
  )

  return (
    <Form {...form}>
      <form className="relative" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="@container mx-auto my-4 grid max-w-5xl grid-cols-12 gap-6 px-4 lg:my-6">
          <div className="col-span-12">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                <Link to="/products">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Link>
              </Button>
              <h1 className="flex-1 shrink-0 text-xl font-semibold tracking-tight whitespace-nowrap sm:grow-0">
                {product ? product.title : 'Create Product'}
              </h1>
            </div>
          </div>
          <div className="col-span-12 @4xl:col-span-8">
            <div className="flex flex-col gap-6">
              <Card className="flex @4xl:hidden">
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
                          <ProductStatusInput {...field} />
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
                        {form.formState.errors.media?.map?.((media, index) => (
                          <p
                            key={index}
                            className="text-destructive text-sm font-medium"
                          >
                            {media?.file?.message}
                          </p>
                        ))}
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
                          <ProductOptionsInput {...field} />
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
                            <ProductVariantsInput
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
          <div className="col-span-12 @4xl:col-span-4 @4xl:col-start-9">
            <div className="flex flex-col gap-6">
              <Card className="hidden @4xl:flex">
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
                          <ProductStatusInput {...field} />
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
                            <ProductCategoryInput {...field} />
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
                            <ProductTypeInput {...field} />
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
                            <ProductVendorInput {...field} />
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
                            <ProductCollectionsInput {...field} />
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
        <div className="sticky bottom-0 z-10 border-t bg-white">
          <div className="@container mx-auto max-w-5xl px-4 py-4">
            <div className="flex justify-end gap-2">
              <Button variant="outline" asChild>
                <Link to="/products">Discard</Link>
              </Button>
              <LoadingButton type="submit" loading={isPending}>
                Save Product
              </LoadingButton>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
