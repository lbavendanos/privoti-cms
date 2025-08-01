import { uuid } from '@/lib/utils'
import { useState } from 'react'
import { type Option } from './product-options-input'
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ProductVariantsSheet } from './product-variants-sheet'
import { Ellipsis, Pencil, PlusCircle, TrashIcon } from 'lucide-react'

export type Variant = {
  uuid: string
  id?: string
  name: string
  price: number
  quantity: number
  options: { value: string }[]
}

type ProductVariantsInputProps = {
  value: Variant[]
  options: Option[]
  onChange: (value: Variant[]) => void
}

export function ProductVariantsInput({
  value: currentVariants,
  options,
  onChange,
}: ProductVariantsInputProps) {
  const appLocale = import.meta.env.VITE_APP_LOCALE
  const appCurrency = import.meta.env.VITE_APP_CURRENCY

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
              <TableHead className="after:bg-border sticky right-0 z-10 w-1/12 bg-white after:absolute after:inset-y-0 after:left-0 after:h-full after:w-px after:content-['']">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentVariants.map((variant) => (
              <TableRow
                key={variant.uuid}
                className="relative cursor-pointer"
                onClick={() => {
                  setSelectedVariant(variant)
                  setOpen(true)
                }}
              >
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
                <TableCell className="after:bg-border sticky right-0 z-10 bg-white after:absolute after:inset-y-0 after:left-0 after:h-full after:w-px after:content-['']">
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
                        <Pencil size={16} aria-hidden="true" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() =>
                          onChange(
                            currentVariants.filter(
                              (v) => v.uuid !== variant.uuid,
                            ),
                          )
                        }
                      >
                        <TrashIcon size={16} aria-hidden="true" />
                        <span>Delete</span>
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
      <ProductVariantsSheet
        options={options}
        value={
          selectedVariant ?? {
            uuid: uuid(),
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
