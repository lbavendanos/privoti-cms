import { capitalize } from '@/lib/utils'
import type { Column } from '@tanstack/react-table'

type FilterSubjectProps<TData> = {
  column: Column<TData>
}

export function FilterSubject<TData>({ column }: FilterSubjectProps<TData>) {
  return (
    <span className="flex items-center gap-1 px-2 font-medium whitespace-nowrap select-none">
      {column.columnDef.meta?.icon && (
        <column.columnDef.meta.icon className="size-4 stroke-[2.25px]" />
      )}
      <span>{capitalize(column.columnDef.meta?.label ?? column.id)}</span>
    </span>
  )
}
