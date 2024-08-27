import { cn } from '@/lib/utils'
import React from 'react'
import { Input, InputProps } from './input'
import { Calendar } from 'lucide-react'

interface DateInputProps extends InputProps {}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ value, className, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          type="date"
          className={cn(!value && 'text-muted-foreground', className)}
          value={value}
          ref={ref}
          {...props}
        />
        <Calendar
          className={cn(
            'absolute right-1.5 top-1/2 -translate-x-1/2 -translate-y-1/2 transform',
            'h-4 w-4',
            !value && 'text-muted-foreground',
          )}
        />
      </div>
    )
  },
)

DateInput.displayName = 'DateInput'

export type { DateInputProps }
export { DateInput }
