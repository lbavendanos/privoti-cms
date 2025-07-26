import { uuid } from '@/lib/utils'
import { useState } from 'react'
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
import { ProductOptionsSheet } from './product-options-sheet'
import { Ellipsis, Pencil, PlusCircle, TrashIcon } from 'lucide-react'

export type Option = {
  uuid: string
  id?: string
  name: string
  values: string[]
}

type ProductOptionsInputProps = {
  value: Option[]
  onChange: (value: Option[]) => void
}

export function ProductOptionsInput({
  value: currentOptions,
  onChange,
}: ProductOptionsInputProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <div className="grid gap-6">
      {currentOptions.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow className="relative">
              <TableHead className="w-2/12 md:w-3/12">Title</TableHead>
              <TableHead className="w-9/12 md:w-8/12">Variant</TableHead>
              <TableHead className="after:bg-border sticky right-0 z-10 w-1/12 bg-white after:absolute after:inset-y-0 after:left-0 after:h-full after:w-px after:content-['']">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOptions.map((option) => (
              <TableRow
                key={option.uuid}
                className="relative cursor-pointer"
                onClick={() => {
                  setSelectedOption(option)
                  setOpen(true)
                }}
              >
                <TableCell>{option.name}</TableCell>
                <TableCell className="space-y-1 space-x-1">
                  {option.values.map((value) => (
                    <Badge key={value} variant="secondary">
                      {value}
                    </Badge>
                  ))}
                </TableCell>
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
                          setSelectedOption(option)
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
                            currentOptions.filter(
                              (o) => o.uuid !== option.uuid,
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
            setSelectedOption(null)
            setOpen(true)
          }}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Add Option
        </Button>
      </div>
      <ProductOptionsSheet
        value={selectedOption ?? { uuid: uuid(), name: '', values: [] }}
        open={open}
        onOpenChange={setOpen}
        onChange={(newOption) => {
          if (selectedOption) {
            onChange(
              currentOptions.map((o) =>
                o.uuid === selectedOption.uuid ? newOption : o,
              ),
            )
          } else {
            onChange([...currentOptions, newOption])
          }

          setSelectedOption(null)
        }}
      />
    </div>
  )
}
