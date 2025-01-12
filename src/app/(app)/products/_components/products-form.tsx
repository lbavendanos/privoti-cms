'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  type FileItem,
  SortableFileInput,
} from '@/components/ui/sortable-file-input'
import { Textarea } from '@/components/ui/textarea'
import { type OptionItem, ProductsOptionsInput } from './products-options-input'
import {
  type VariantItem,
  ProductsVariantsInput,
} from './products-variants-input'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import MultipleSelector, { Option } from '@/components/ui/multiple-selector'
import { MultipleTag } from '@/components/ui/multiple-tag'

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

export function ProductsForm() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [options, setOptions] = useState<OptionItem[]>([])
  const [variants, setVariants] = useState<VariantItem[]>([])
  const [tags, setTags] = useState<string[]>([])

  return (
    <form className="relative">
      <div className="container my-4 lg:my-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-10 md:col-start-2">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                <Link href="/products">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Link>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Create Product
              </h1>
              {/* <Badge variant="outline" className="ml-auto sm:ml-0"> */}
              {/*   In stock */}
              {/* </Badge> */}
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
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        type="text"
                        className="w-full"
                        placeholder="Winter Jacket"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subtitle">
                        Subtitle{' '}
                        <span className="text-muted-foreground">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id="subtitle"
                        type="text"
                        className="w-full"
                        placeholder="Comfortable, warm, and stylish"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Description{' '}
                        <span className="text-muted-foreground">
                          (optional)
                        </span>
                      </Label>
                      <Textarea
                        id="description"
                        className="min-h-32"
                        placeholder="This winter jacket is perfect for cold weather. It's comfortable, warm, and stylish."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                  <CardDescription>
                    Add images and videos to showcase the product.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SortableFileInput
                    id="media"
                    name="media"
                    value={files}
                    onChange={setFiles}
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
                  <ProductsOptionsInput value={options} onChange={setOptions} />
                </CardContent>
              </Card>
              {options.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Variants</CardTitle>
                    <CardDescription>
                      Add variants to the product, such as different sizes or
                      colors.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProductsVariantsInput
                      options={options}
                      value={variants}
                      onChange={setVariants}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <div className="col-span-12 md:col-span-10 md:col-start-2 xl:col-span-3 xl:col-start-9">
            <div className="flex flex-col gap-6">
              {/* <Card> */}
              {/*   <CardHeader> */}
              {/*     <CardTitle>Product Status</CardTitle> */}
              {/*   </CardHeader> */}
              {/*   <CardContent> */}
              {/*     <div className="grid gap-6"> */}
              {/*       <div className="grid gap-3"> */}
              {/*         <Label htmlFor="status">Status</Label> */}
              {/*         <Select> */}
              {/*           <SelectTrigger id="status" aria-label="Select status"> */}
              {/*             <SelectValue placeholder="Select status" /> */}
              {/*           </SelectTrigger> */}
              {/*           <SelectContent> */}
              {/*             <SelectItem value="draft">Draft</SelectItem> */}
              {/*             <SelectItem value="published">Active</SelectItem> */}
              {/*             <SelectItem value="archived">Archived</SelectItem> */}
              {/*           </SelectContent> */}
              {/*         </Select> */}
              {/*       </div> */}
              {/*     </div> */}
              {/*   </CardContent> */}
              {/* </Card> */}
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
              {/* <Card> */}
              {/*   <CardHeader> */}
              {/*     <CardTitle>Archive Product</CardTitle> */}
              {/*     <CardDescription> */}
              {/*       Lipsum dolor sit amet, consectetur adipiscing elit. */}
              {/*     </CardDescription> */}
              {/*   </CardHeader> */}
              {/*   <CardContent> */}
              {/*     <div></div> */}
              {/*     <Button size="sm" variant="secondary"> */}
              {/*       Archive Product */}
              {/*     </Button> */}
              {/*   </CardContent> */}
              {/* </Card> */}
            </div>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 -mx-4 border-t bg-white">
        <div className="container py-4">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-10 md:col-start-2">
              <div className="flex justify-end gap-2 px-4">
                <Button variant="outline" asChild>
                  <Link href="/products">Discard</Link>
                </Button>
                <Button type="submit">Save Product</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
