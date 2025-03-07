'use client'

import { useState } from 'react'
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
import { ProductsOptionsSheet } from './products-options-sheet'
import { Ellipsis, Pencil, PlusCircle, Trash2 } from 'lucide-react'

export type OptionItem = {
  id: string
  name: string
  values: string[]
}

type ProductsOptionsInputProps = {
  value: OptionItem[]
  onChange: React.Dispatch<React.SetStateAction<OptionItem[]>>
}

export function ProductsOptionsInput({
  value,
  onChange,
}: ProductsOptionsInputProps) {
  const [selectedOption, setSelectedOption] = useState<OptionItem | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <div className="grid gap-6">
      {value.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow className="relative">
              <TableHead className="w-2/12 md:w-3/12">Title</TableHead>
              <TableHead className="w-9/12 md:w-8/12">Variant</TableHead>
              <TableHead className="sticky right-0 z-10 w-1/12 bg-white after:absolute after:inset-y-0 after:left-0 after:h-full after:w-px after:bg-border after:content-['']">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {value.map((option) => (
              <TableRow key={option.id} className="relative">
                <TableCell>{option.name}</TableCell>
                <TableCell className="space-x-1 space-y-1">
                  {option.values.map((value) => (
                    <Badge key={value} variant="secondary">
                      {value}
                    </Badge>
                  ))}
                </TableCell>
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
                          setSelectedOption(option)
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
            setSelectedOption(null)
            setOpen(true)
          }}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Add Option
        </Button>
      </div>
      <ProductsOptionsSheet
        value={
          selectedOption || { id: Date.now().toString(), name: '', values: [] }
        }
        open={open}
        onOpenChange={setOpen}
        onChange={(option) => {
          if (selectedOption) {
            onChange(
              value.map((item) =>
                item.id === selectedOption.id ? (option as OptionItem) : item,
              ),
            )
          } else {
            onChange([...value, option as OptionItem])
          }

          setSelectedOption(null)
        }}
      />
    </div>
  )
}
