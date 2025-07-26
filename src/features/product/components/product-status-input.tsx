import { capitalize, cn } from '@/lib/utils'
import { getProductStatusTextStyle } from '../lib/utils'
import { PRODUCT_STATUS_LIST } from '../lib/constants'
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

type ProductStatusInputProps = {
  value?: string
  onChange?: React.Dispatch<React.SetStateAction<string>>
}

export function ProductStatusInput({
  value,
  onChange,
  ...props
}: ProductStatusInputProps) {
  return (
    <Select onValueChange={onChange} defaultValue={value} value={value}>
      <SelectTrigger
        {...props}
        className="w-full [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
      >
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
        {PRODUCT_STATUS_LIST.map((status) => (
          <SelectItem key={status} value={status} className="cursor-pointer">
            <span className="flex items-center gap-2">
              <StatusDot
                className={cn('size-2', getProductStatusTextStyle(status))}
              />
              <span className="truncate">{capitalize(status)}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
