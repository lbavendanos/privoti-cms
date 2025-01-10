import { useState } from 'react'
import React from 'react'
import { type OptionItem } from './products-options-input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ProductsVariantsSheet } from './products-variants-sheet'
import { Ellipsis, Pencil, PlusCircle, Trash2 } from 'lucide-react'

export type VariantItem = {
  id: string
  options: { id: string; value: string }[]
  price: number
  quantity: number
}

type ProductsVariantsInputProps = {
  options: OptionItem[]
  value: VariantItem[]
  onChange: React.Dispatch<React.SetStateAction<VariantItem[]>>
}

export function ProductsVariantsInput({
  options,
  value,
  onChange,
}: ProductsVariantsInputProps) {
  const appLocale = process.env.NEXT_PUBLIC_APP_LOCALE
  const appCurrency = process.env.NEXT_PUBLIC_APP_CURRENCY

  const [selectedVariant, setSelectedVariant] = useState<VariantItem | null>(
    null,
  )
  const [open, setOpen] = useState(false)

  return (
    <div className="grid gap-6">
      {value.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow className="relative">
              <TableHead className="w-5/12">Variant</TableHead>
              <TableHead className="w-3/12">Price</TableHead>
              <TableHead className="w-3/12">Quantity</TableHead>
              <TableHead className="sticky right-0 w-1/12 bg-white">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {value.map((option) => (
              <TableRow key={option.id} className="relative">
                <TableCell className="space-x-1 space-y-1">
                  {option.options.map((opt, index) => (
                    <React.Fragment key={opt.id}>
                      <Badge variant="secondary">{opt.value}</Badge>
                      {index < option.options.length - 1 ? ' /' : ''}
                    </React.Fragment>
                  ))}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat(appLocale, {
                    style: 'currency',
                    currency: appCurrency,
                  }).format(option.price)}
                </TableCell>
                <TableCell>{option.quantity}</TableCell>
                <TableCell className="sticky right-0 bg-white">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full shadow-none"
                        aria-label="Open edit menu"
                      >
                        <Ellipsis
                          size={16}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedVariant(option)
                          setOpen(true)
                        }}
                      >
                        <Pencil /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          onChange(
                            value.filter((item) => item.id !== option.id),
                          )
                        }
                      >
                        <Trash2 />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Separator />
      <div className="flex items-center justify-center">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="gap-1"
          onClick={() => {
            setSelectedVariant(null)
            setOpen(true)
          }}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Add Variant
        </Button>
      </div>
      <ProductsVariantsSheet
        options={options}
        value={
          selectedVariant || {
            id: Date.now().toString(),
            options: options.map((opt) => ({
              id: opt.id,
              value: '',
            })),
            price: 0,
            quantity: 0,
          }
        }
        onChange={(variant) => {
          if (selectedVariant) {
            onChange(
              value.map((item) =>
                item.id === selectedVariant.id
                  ? (variant as VariantItem)
                  : item,
              ),
            )
          } else {
            onChange([...value, variant as VariantItem])
          }

          setSelectedVariant(null)
        }}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  )
}
