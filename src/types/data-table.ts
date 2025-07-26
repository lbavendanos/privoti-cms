import type { RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string
    placeholder?: string
    variant?: FilterVariant
    options?: FilterOption[]
    icon?: React.FC<React.SVGProps<SVGSVGElement>>
  }
}

export type FilterVariant = 'text' | 'number' | 'boolean' | 'select' | 'date'
export type FilterOption = {
  label: string
  value: string
  icon?: React.FC<React.SVGProps<SVGSVGElement>>
}
