'use client'

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select'

function StatusDot({ className }: { className?: string }) {
  return (
    <svg
      width="8"
      height="8"
      fill="currentColor"
      viewBox="0 0 8 8"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="4" cy="4" r="4" />
    </svg>
  )
}

type ProductsStatusInputProps = {
  value?: string
  onChange?: React.Dispatch<React.SetStateAction<string>>
}

export function ProductsStatusInput({
  value,
  onChange,
  ...props
}: ProductsStatusInputProps) {
  return (
    <Select onValueChange={onChange} defaultValue={value} value={value}>
      <SelectTrigger
        {...props}
        className="w-full [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
      >
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
        <SelectItem value="draft" className="cursor-pointer">
          <span className="flex items-center gap-2">
            <StatusDot className="size-2 text-amber-500" />
            <span className="truncate">Draft</span>
          </span>
        </SelectItem>
        <SelectItem value="active" className="cursor-pointer">
          <span className="flex items-center gap-2">
            <StatusDot className="size-2 text-emerald-600" />
            <span className="truncate">Active</span>
          </span>
        </SelectItem>
        <SelectItem value="archived" className="cursor-pointer">
          <span className="flex items-center gap-2">
            <StatusDot className="size-2 text-gray-500" />
            <span className="truncate">Archived</span>
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
