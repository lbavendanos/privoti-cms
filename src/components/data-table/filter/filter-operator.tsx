import type { Column } from '@tanstack/react-table'

type FilterOperatorProps<TData> = {
  column: Column<TData>
}

function makeOperatorLabel<TData>(option: Column<TData>): string {
  const filterValue = option.getFilterValue()
  const variant = option.columnDef.meta?.variant

  switch (variant) {
    case 'text':
      return 'contains'
    case 'select':
      return Array.isArray(filterValue) && filterValue.length > 1
        ? 'is any of'
        : 'is'
    case 'date':
      return Array.isArray(filterValue) && filterValue.length > 1
        ? 'is between'
        : 'is'
    default:
      return ''
  }
}

export function FilterOperator<TData>({ column }: FilterOperatorProps<TData>) {
  const label = makeOperatorLabel(column)

  if (!label) return null

  return (
    <div className="m-0 inline-flex h-full w-fit items-center rounded-none p-0 px-2 whitespace-nowrap">
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  )
}
