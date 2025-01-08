import { useState } from 'react'
import { ProductsOptionsSheet } from './products-options-sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Pencil, PlusCircle, X } from 'lucide-react'

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
            <TableRow>
              <TableHead className="w-2/12">Title</TableHead>
              <TableHead className="w-7/12">Variant</TableHead>
              <TableHead className="w-3/12">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {value.map((option) => (
              <TableRow key={option.id}>
                <TableCell className="font-semibold">{option.name}</TableCell>
                <TableCell className="space-x-1 space-y-1">
                  {option.values.map((value) => (
                    <Badge key={value} variant="secondary">
                      {value}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedOption(option)
                      setOpen(true)
                    }}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onChange(value.filter((item) => item.id !== option.id))
                    }}
                  >
                    <X />
                  </Button>
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
          onClick={() => setOpen(true)}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Add Option
        </Button>
      </div>
      <ProductsOptionsSheet
        value={
          selectedOption || { id: Date.now().toString(), name: '', values: [] }
        }
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
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  )
}
