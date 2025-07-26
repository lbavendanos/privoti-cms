import type { Column } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FilterValue } from './filter-value'
import { FilterSubject } from './filter-subject'
import { FilterOperator } from './filter-operator'
import { X } from 'lucide-react'

type ActiveFilterProps<TData> = {
  column: Column<TData>
}

export function ActiveFilter<TData>({ column }: ActiveFilterProps<TData>) {
  return (
    <div className="border-border bg-background flex h-7 items-center overflow-hidden rounded-2xl border text-xs shadow-xs">
      <FilterSubject column={column} />
      <Separator orientation="vertical" />
      <FilterOperator column={column} />
      <Separator orientation="vertical" />
      <FilterValue column={column} />
      <Separator orientation="vertical" />
      <Button
        variant="ghost"
        className="h-full w-7 rounded-none rounded-r-2xl text-xs"
        onClick={() => column.setFilterValue(undefined)}
      >
        <X className="size-4 -translate-x-0.5" />
      </Button>
    </div>
  )
}
