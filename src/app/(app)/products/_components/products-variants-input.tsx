'use client'

import { useState } from 'react'
import React from 'react'
import { type Option } from './products-options-input'
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

export type Variant = {
  uuid: string
  id?: string
  name: string
  price: number
  quantity: number
  options: { value: string }[]
}

type ProductsVariantsInputProps = {
  value: Variant[]
  options: Option[]
  onChange: (value: Variant[]) => void
}

export function ProductsVariantsInput({
  value: currentVariants,
  options,
  onChange,
}: ProductsVariantsInputProps) {
  const appLocale = process.env.NEXT_PUBLIC_APP_LOCALE
  const appCurrency = process.env.NEXT_PUBLIC_APP_CURRENCY

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <div className="grid gap-6">
      {currentVariants.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow className="relative">
              <TableHead className="w-2/12">Name</TableHead>
              {options.map((option) => (
                <TableHead key={option.uuid} className="w-2/12">
                  {option.name}
                </TableHead>
              ))}
              <TableHead className="w-3/12">Price</TableHead>
              <TableHead className="w-3/12">Quantity</TableHead>
              <TableHead className="sticky right-0 z-10 w-1/12 bg-white after:absolute after:inset-y-0 after:left-0 after:h-full after:w-px after:bg-border after:content-['']">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentVariants.map((variant) => (
              <TableRow key={variant.uuid} className="relative">
                <TableCell>{variant.name}</TableCell>
                {options.map((o, oIndex) => (
                  <TableCell key={o.uuid} className="w-2/12">
                    {variant.options[oIndex] ? (
                      <Badge variant="secondary">
                        {variant.options[oIndex].value}
                      </Badge>
                    ) : (
                      <span className="px-5 py-0.5">-</span>
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  {new Intl.NumberFormat(appLocale, {
                    style: 'currency',
                    currency: appCurrency,
                  }).format(variant.price)}
                </TableCell>
                <TableCell>{variant.quantity}</TableCell>
                <TableCell className="sticky right-0 z-10 bg-white after:absolute after:inset-y-0 after:left-0 after:h-full after:w-px after:bg-border after:content-['']">
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
                          setSelectedVariant(variant)
                          setOpen(true)
                        }}
                      >
                        <Pencil /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          onChange(
                            currentVariants.filter(
                              (v) => v.uuid !== variant.uuid,
                            ),
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
          selectedVariant ?? {
            uuid: crypto.randomUUID(),
            name: '',
            price: 0,
            quantity: 0,
            options: options.map(() => ({
              value: '',
            })),
          }
        }
        open={open}
        onOpenChange={setOpen}
        onChange={(newVariant) => {
          if (selectedVariant) {
            onChange(
              currentVariants.map((v) =>
                v.uuid === selectedVariant.uuid ? newVariant : v,
              ),
            )
          } else {
            onChange([...currentVariants, newVariant])
          }

          setSelectedVariant(null)
        }}
      />
    </div>
  )
}
