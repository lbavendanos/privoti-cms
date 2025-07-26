import { useCallback, useMemo, useState } from 'react'
import type { Column } from '@tanstack/react-table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { FilterValueController } from './filter-value'
import { FilterIcon } from 'lucide-react'

type FilterSelectorProps<TData> = {
  columns: Column<TData, unknown>[]
}

export function FilterSelector<TData>({ columns }: FilterSelectorProps<TData>) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<Column<TData>>()

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open)

    if (!open) setTimeout(() => setSelectedColumn(undefined), 100)
  }, [])

  const handleSelectColumn = useCallback((column: Column<TData>) => {
    setSelectedColumn(column)
  }, [])

  const commandItems = useMemo(
    () =>
      columns.map((column) => (
        <CommandItem
          key={column.id}
          value={column.id}
          onSelect={() => handleSelectColumn(column)}
          className="group"
        >
          <div className="flex w-full items-center justify-between">
            <div className="inline-flex items-center gap-1.5">
              {column.columnDef.meta?.icon && (
                <column.columnDef.meta.icon
                  strokeWidth={2.25}
                  className="size-4"
                />
              )}
              <span>{column.columnDef.meta?.label ?? column.id}</span>
            </div>
          </div>
        </CommandItem>
      )),
    [columns, handleSelectColumn],
  )

  const content = useMemo(
    () =>
      selectedColumn ? (
        <FilterValueController column={selectedColumn} />
      ) : (
        <Command loop>
          <CommandInput placeholder="Search fields..." />
          <CommandEmpty>No fields found.</CommandEmpty>
          <CommandList className="max-h-fit">
            <CommandGroup>{commandItems}</CommandGroup>
          </CommandList>
        </Command>
      ),
    [selectedColumn, commandItems],
  )

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-7">
          <FilterIcon className="size-4 opacity-60" />
          <span>Filter</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="w-fit origin-(--radix-popover-content-transform-origin) p-0"
      >
        {content}
      </PopoverContent>
    </Popover>
  )
}
